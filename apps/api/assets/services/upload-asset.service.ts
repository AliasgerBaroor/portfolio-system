
import { createHash, randomUUID } from "node:crypto";
import { AssetStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { env } from "../../lib/env";

import {
    sanitizeFilename,
    validateAsset,
    type AssetCategory,
} from "../domain/asset.rules";

import {
    validateAssetContent,
    type SupportedAssetMimeType,
} from "../domain/asset-content.rules";

import { storageProvider } from "../storage/storage.factory";

interface UploadAssetInput {
    applicationId: string;
    environmentId: string;
    credentialId: string;
    category: AssetCategory;
    filename: string;
    mimeType: string;
    body: Uint8Array;
}

export class AssetUploadError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404,
    ) {
        super(message);
        this.name = "AssetUploadError";
    }
}

export async function uploadAsset(input: UploadAssetInput) {
    const filename = sanitizeFilename(input.filename);

    // Validate file metadata.
    const validation = validateAsset({
        category: input.category,
        filename: input.filename,
        mimeType: input.mimeType,
        sizeBytes: input.body.byteLength,
    });

    if (!validation.valid) {
        throw new AssetUploadError(
            validation.errors.join(" "),
            400,
        );
    }

    // Validate actual binary content, not just the declared MIME type.
    const contentValid = await validateAssetContent({
        category: input.category,
        mimeType: input.mimeType as SupportedAssetMimeType,
        body: input.body,
    });

    if (!contentValid) {
        throw new AssetUploadError(
            "File content does not match the declared file type.",
            400,
        );
    }

    const checksum = createHash("sha256")
        .update(input.body)
        .digest("hex");

    // Never use the original filename as the storage key.
    const storageKey = `${input.environmentId}/${randomUUID()}`;

    // Verify ownership and create the UPLOADING record.
    const asset = await prisma.$transaction(async (tx) => {
        const application = await tx.application.findFirst({
            where: {
                id: input.applicationId,
                status: "ACTIVE",
                deletedAt: null,
            },
            select: { id: true },
        });

        if (!application) {
            throw new AssetUploadError(
                "Application not found or inactive.",
                404,
            );
        }

        const environment = await tx.applicationEnvironment.findFirst({
            where: {
                id: input.environmentId,
                applicationId: input.applicationId,
                status: "ACTIVE",
                deletedAt: null,
            },
            select: { id: true },
        });

        if (!environment) {
            throw new AssetUploadError(
                "Environment not found or inactive.",
                404,
            );
        }

        const credential = await tx.applicationCredential.findFirst({
            where: {
                id: input.credentialId,
                environmentId: input.environmentId,
                revokedAt: null,
            },
            select: { id: true },
        });

        if (!credential) {
            throw new AssetUploadError(
                "Application credential is unavailable.",
                404,
            );
        }

        return tx.asset.create({
            data: {
                environmentId: input.environmentId,
                storageProvider: env.ASSET_STORAGE_PROVIDER,
                storageBucket: env.SUPABASE_STORAGE_BUCKET,
                storageKey,
                originalFilename: filename,
                mimeType: input.mimeType,
                sizeBytes: input.body.byteLength,
                checksum,
                status: AssetStatus.UPLOADING,
                createdByCredentialId: input.credentialId,
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
    });

    let storageUploadAttempted = false;

    try {
        storageUploadAttempted = true;

        await storageProvider.upload({
            storageKey,
            body: input.body,
            contentType: input.mimeType,
        });

        return await prisma.asset.update({
            where: { id: asset.id },
            data: {
                status: AssetStatus.READY,
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
    } catch (error) {
        // Attempt to remove any partially or fully uploaded object.
        if (storageUploadAttempted) {
            try {
                await storageProvider.delete({ storageKey });
            } catch (cleanupError) {
                console.error(
                    "Asset storage cleanup failed:",
                    {
                        assetId: asset.id,
                        storageKey,
                        error: cleanupError,
                    },
                );
            }
        }

        // Preserve the failed upload in the database for diagnosis.
        try {
            await prisma.asset.update({
                where: { id: asset.id },
                data: {
                    status: AssetStatus.FAILED,
                },
            });
        } catch (databaseError) {
            console.error(
                "Failed to update Asset status after upload failure:",
                {
                    assetId: asset.id,
                    error: databaseError,
                },
            );
        }

        throw error;
    }
}
