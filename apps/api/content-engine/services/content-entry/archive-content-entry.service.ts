
import {
    ContentEntryStatus,
    Prisma,
} from "@prisma/client";

import { prisma } from "../../../lib/prisma";

export class ContentEntryArchiveError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404 | 409,
    ) {
        super(message);
        this.name = "ContentEntryArchiveError";
    }
}

export async function archiveContentEntry(
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
                throw new ContentEntryArchiveError(
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
                throw new ContentEntryArchiveError(
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
                throw new ContentEntryArchiveError(
                    "Active content model not found.",
                    404,
                );
            }

            // Serialize archive operations with updates and publishing.
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
                throw new ContentEntryArchiveError(
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
                },
            });

            if (!entry) {
                throw new ContentEntryArchiveError(
                    "Content entry not found.",
                    404,
                );
            }

            if (entry.status === ContentEntryStatus.ARCHIVED) {
                throw new ContentEntryArchiveError(
                    "Content entry is already archived.",
                    409,
                );
            }

            const updated = await tx.contentEntry.updateMany({
                where: {
                    id: entryId,
                    modelId,
                    environmentId,
                    status: entry.status,
                    deletedAt: null,
                },
                data: {
                    status: ContentEntryStatus.ARCHIVED,
                    archivedFromStatus: entry.status,
                },
            });

            if (updated.count !== 1) {
                throw new ContentEntryArchiveError(
                    "Content entry status changed. Please retry.",
                    409,
                );
            }

            return {
                id: entry.id,
                modelId,
                environmentId,
                status: ContentEntryStatus.ARCHIVED,
                archivedFromStatus: entry.status,
            };
        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
    );
}
