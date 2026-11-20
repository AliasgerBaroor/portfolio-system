
import { AssetStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { storageProvider } from "../storage/storage.factory";
import { AssetNotFoundError } from "./get-asset.service";
import { randomUUID } from "node:crypto";

interface DeleteAssetInput {
    applicationId: string;
    environmentId: string;
    assetId: string;
}

export class AssetDeletionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AssetDeletionError";
    }
}

export async function deleteAsset(input: DeleteAssetInput) {
    const application = await prisma.application.findFirst({
        where: {
            id: input.applicationId,
            status: "ACTIVE",
            deletedAt: null,
        },
        select: { id: true },
    });

    if (!application) {
        throw new AssetNotFoundError("Application not found or inactive.");
    }

    const environment = await prisma.applicationEnvironment.findFirst({
        where: {
            id: input.environmentId,
            applicationId: input.applicationId,
            status: "ACTIVE",
            deletedAt: null,
        },
        select: { id: true },
    });

    if (!environment) {
        throw new AssetNotFoundError("Environment not found or inactive.");
    }

    const asset = await prisma.asset.findFirst({
        where: {
            id: input.assetId,
            environmentId: input.environmentId,
            status: AssetStatus.READY,
            deletedAt: null,
        },
        select: {
            id: true,
            storageKey: true,
        },
    });

    if (!asset) {
        throw new AssetNotFoundError();
    }

    const deletionLeaseToken = randomUUID();
    const deletionLeaseExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Atomically claim a READY asset for deletion.
    const claim = await prisma.asset.updateMany({
        where: {
            id: asset.id,
            status: AssetStatus.READY,
            deletedAt: null,
        },
        data: {
            status: AssetStatus.DELETING,
            deletionLeaseToken,
            deletionLeaseExpiresAt,
        },
    });

    if (claim.count === 0) {
        throw new AssetDeletionError(
            "Asset deletion is already being processed. Please retry.",
        );
    }

    // If storage deletion fails, leave the asset in DELETING.
    // A subsequent request can retry this operation.
    try {
        await storageProvider.delete({
            storageKey: asset.storageKey,
        });
    } catch (error) {
        console.error("Asset storage deletion failed:", {
            assetId: asset.id,
            error,
        });

        throw new AssetDeletionError(
            "Unable to delete the stored asset. The deletion remains pending and can be retried.",
        );
    }

    // If this database update fails, the asset remains DELETING.
    // A retry can safely attempt storage deletion again.
    // Only the current lease owner can complete deletion.
    try {
        const completion = await prisma.asset.updateMany({
            where: {
                id: asset.id,
                status: AssetStatus.DELETING,
                deletedAt: null,
                deletionLeaseToken,
            },
            data: {
                status: AssetStatus.DELETED,
                deletedAt: new Date(),
                deletionLeaseToken: null,
                deletionLeaseExpiresAt: null,
            },
        });

        if (completion.count === 0) {
            throw new AssetDeletionError(
                "Deletion lease ownership was lost. Reconciliation is required.",
            );
        }

        return await prisma.asset.findUniqueOrThrow({
            where: { id: asset.id },
            select: {
                id: true,
                status: true,
                deletedAt: true,
            },
        });
    } catch (error) {
        console.error("Asset deletion completion failed:", {
            assetId: asset.id,
            error,
        });

        if (error instanceof AssetDeletionError) {
            throw error;
        }

        throw new AssetDeletionError(
            "Storage deletion succeeded, but database completion failed. Reconciliation is required.",
        );
    }
}
