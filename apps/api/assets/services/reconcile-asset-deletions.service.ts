
import { randomUUID } from "node:crypto";
import { AssetStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { storageProvider } from "../storage/storage.factory";

const DEFAULT_BATCH_SIZE = 20;
const DELETION_LEASE_MS = 5 * 60 * 1000;

interface ReconcileAssetDeletionsInput {
    batchSize?: number;
}

export async function reconcileAssetDeletions(
    input: ReconcileAssetDeletionsInput = {},
) {
    const batchSize = Math.max(
        1,
        Math.min(input.batchSize ?? DEFAULT_BATCH_SIZE, 100),
    );

    const now = new Date();

    const candidates = await prisma.asset.findMany({
        where: {
            status: AssetStatus.DELETING,
            deletedAt: null,
            OR: [
                { deletionLeaseToken: null },
                { deletionLeaseExpiresAt: null },
                { deletionLeaseExpiresAt: { lte: now } },
            ],
        },
        select: {
            id: true,
            storageKey: true,
        },
        orderBy: { createdAt: "asc" },
        take: batchSize,
    });

    let claimed = 0;
    let completed = 0;
    let failed = 0;
    let ownershipLost = 0;

    for (const asset of candidates) {
        const deletionLeaseToken = randomUUID();
        const leaseExpiresAt = new Date(
            Date.now() + DELETION_LEASE_MS,
        );

        const claim = await prisma.asset.updateMany({
            where: {
                id: asset.id,
                status: AssetStatus.DELETING,
                deletedAt: null,
                OR: [
                    { deletionLeaseToken: null },
                    { deletionLeaseExpiresAt: null },
                    { deletionLeaseExpiresAt: { lte: new Date() } },
                ],
            },
            data: {
                deletionLeaseToken,
                deletionLeaseExpiresAt: leaseExpiresAt,
            },
        });

        if (claim.count === 0) {
            continue;
        }

        claimed++;

        try {
            await storageProvider.delete({
                storageKey: asset.storageKey,
            });

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
                ownershipLost++;
                continue;
            }

            completed++;
        } catch (error) {
            failed++;

            console.error("Asset deletion reconciliation failed:", {
                assetId: asset.id,
                error,
            });
        }
    }

    return {
        scanned: candidates.length,
        claimed,
        completed,
        failed,
        ownershipLost,
    };
}
