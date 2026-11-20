
import {
    ContentEntryStatus,
    ContentVersionStatus,
    Prisma,
} from "@prisma/client";

import { prisma } from "../../../lib/prisma";

export class ContentEntryRestoreError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404 | 409,
    ) {
        super(message);
        this.name = "ContentEntryRestoreError";
    }
}

export async function restoreContentEntry(
    applicationId: string,
    environmentId: string,
    modelId: string,
    entryId: string,
) {
    return prisma.$transaction(
        async (tx) => {
            const application = await tx.application.findFirst({
                where: {
                    id: applicationId,
                    status: "ACTIVE",
                    deletedAt: null,
                },
                select: { id: true },
            });

            if (!application) {
                throw new ContentEntryRestoreError(
                    "Application not found or inactive.",
                    404,
                );
            }

            const environment = await tx.applicationEnvironment.findFirst({
                where: {
                    id: environmentId,
                    applicationId,
                    status: "ACTIVE",
                    deletedAt: null,
                },
                select: { id: true },
            });

            if (!environment) {
                throw new ContentEntryRestoreError(
                    "Environment not found or inactive.",
                    404,
                );
            }

            const model = await tx.contentModel.findFirst({
                where: {
                    id: modelId,
                    applicationId,
                    status: "ACTIVE",
                    deletedAt: null,
                },
                select: { id: true },
            });

            if (!model) {
                throw new ContentEntryRestoreError(
                    "Active content model not found.",
                    404,
                );
            }

            // Serialize restoration with updates, publishing and archiving.
            const lockedEntries = await tx.$queryRaw<Array<{ id: string }>>(
                Prisma.sql`
                    SELECT "id"
                    FROM "ContentEntry"
                    WHERE "id" = ${entryId}
                      AND "modelId" = ${modelId}
                      AND "environmentId" = ${environmentId}
                      AND "deletedAt" IS NULL
                    FOR UPDATE
                `,
            );

            if (lockedEntries.length === 0) {
                throw new ContentEntryRestoreError(
                    "Content entry not found.",
                    404,
                );
            }

            const entry = await tx.contentEntry.findFirst({
                where: {
                    id: entryId,
                    modelId,
                    environmentId,
                    deletedAt: null,
                },
                select: {
                    id: true,
                    status: true,
                    archivedFromStatus: true,
                    currentDraftVersion: {
                        select: { status: true },
                    },
                    publishedVersion: {
                        select: { status: true },
                    },
                },
            });

            if (!entry) {
                throw new ContentEntryRestoreError(
                    "Content entry not found.",
                    404,
                );
            }

            if (entry.status !== ContentEntryStatus.ARCHIVED) {
                throw new ContentEntryRestoreError(
                    "Only archived content entries can be restored.",
                    409,
                );
            }

            // Prefer the explicitly saved lifecycle status.
            // Fall back to version pointers for older archived entries.
            let restoreStatus = entry.archivedFromStatus;

            if (restoreStatus === null) {
                if (
                    entry.publishedVersion?.status ===
                    ContentVersionStatus.PUBLISHED
                ) {
                    restoreStatus = ContentEntryStatus.PUBLISHED;
                } else if (
                    entry.currentDraftVersion?.status ===
                    ContentVersionStatus.DRAFT
                ) {
                    restoreStatus = ContentEntryStatus.DRAFT;
                }
            }

            if (
                restoreStatus !== ContentEntryStatus.DRAFT &&
                restoreStatus !== ContentEntryStatus.PUBLISHED
            ) {
                throw new ContentEntryRestoreError(
                    "Previous entry status cannot be determined safely.",
                    409,
                );
            }

            const updated = await tx.contentEntry.updateMany({
                where: {
                    id: entryId,
                    modelId,
                    environmentId,
                    status: ContentEntryStatus.ARCHIVED,
                    deletedAt: null,
                },
                data: {
                    status: restoreStatus,
                    archivedFromStatus: null,
                },
            });

            if (updated.count !== 1) {
                throw new ContentEntryRestoreError(
                    "Content entry status changed. Please retry.",
                    409,
                );
            }

            return {
                id: entry.id,
                modelId,
                environmentId,
                status: restoreStatus,
                archivedFromStatus: null,
            };
        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
    );
}
