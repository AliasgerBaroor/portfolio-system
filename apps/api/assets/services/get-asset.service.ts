
import { AssetStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma";

interface GetAssetInput {
    applicationId: string;
    environmentId: string;
    assetId: string;
}

export class AssetNotFoundError extends Error {
    constructor(message = "Asset not found.") {
        super(message);
        this.name = "AssetNotFoundError";
    }
}

export async function getAsset(input: GetAssetInput) {
    // Confirm the application is active.
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

    // Confirm the environment belongs to this application.
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

    // Return only READY Assets belonging to this environment.
    const asset = await prisma.asset.findFirst({
        where: {
            id: input.assetId,
            environmentId: input.environmentId,
            status: AssetStatus.READY,
            deletedAt: null,
        },
        select: {
            id: true,
            environmentId: true,
            originalFilename: true,
            mimeType: true,
            sizeBytes: true,
            checksum: true,
            status: true,
            createdAt: true,
        },
    });

    if (!asset) {
        throw new AssetNotFoundError();
    }

    return asset;
}
