
import { AssetStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { storageProvider } from "../storage/storage.factory";
import { AssetNotFoundError } from "./get-asset.service";

const SIGNED_URL_EXPIRY_SECONDS = 60;

interface GetAssetDownloadInput {
    applicationId: string;
    environmentId: string;
    assetId: string;
}

export async function getAssetDownload(input: GetAssetDownloadInput) {
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

    const signedUrl = await storageProvider.getSignedUrl({
        storageKey: asset.storageKey,
        expiresInSeconds: SIGNED_URL_EXPIRY_SECONDS,
    });

    return {
        assetId: asset.id,
        downloadUrl: signedUrl,
        expiresInSeconds: SIGNED_URL_EXPIRY_SECONDS,
        expiresAt: new Date(
            Date.now() + SIGNED_URL_EXPIRY_SECONDS * 1000,
        ).toISOString(),
    };
}
