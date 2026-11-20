
import {
    ContentEntryStatus,
    ContentVersionStatus,
    Prisma,
} from "@prisma/client";

import { prisma } from "../../../lib/prisma";

export class ContentEntryPublishError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404 | 409,
    ) {
        super(message);
        this.name = "ContentEntryPublishError";
    }
}

export async function publishContentEntry(
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
                throw new ContentEntryPublishError(
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
                throw new ContentEntryPublishError(
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
                throw new ContentEntryPublishError(
                    "Active content model not found.",
                    404,
                );
            }

            // Serialize publishing with updates to this entry.
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
                throw new ContentEntryPublishError(
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
                    currentDraftVersionId: true,
                    publishedVersionId: true,
                },
            });

            if (!entry) {
                throw new ContentEntryPublishError(
                    "Content entry not found.",
                    404,
                );
            }

            if (entry.status === ContentEntryStatus.ARCHIVED) {
                throw new ContentEntryPublishError(
                    "Archived content entries cannot be published.",
                    409,
                );
            }

            if (!entry.currentDraftVersionId) {
                throw new ContentEntryPublishError(
                    "Content entry has no draft to publish.",
                    409,
                );
            }

            const draft = await tx.contentVersion.findFirst({
                where: {
                    id: entry.currentDraftVersionId,
                    entryId,
                    status: ContentVersionStatus.DRAFT,
                },
                select: { id: true },
            });

            if (!draft) {
                throw new ContentEntryPublishError(
                    "Current draft is no longer available for publishing.",
                    409,
                );
            }

            if (entry.publishedVersionId) {
                const previousPublished =
                    await tx.contentVersion.updateMany({
                        where: {
                            id: entry.publishedVersionId,
                            entryId,
                            status: ContentVersionStatus.PUBLISHED,
                        },
                        data: {
                            status: ContentVersionStatus.SUPERSEDED,
                        },
                    });

                if (previousPublished.count !== 1) {
                    throw new ContentEntryPublishError(
                        "Previous published version changed. Please retry.",
                        409,
                    );
                }
            }

            const published = await tx.contentVersion.updateMany({
                where: {
                    id: draft.id,
                    entryId,
                    status: ContentVersionStatus.DRAFT,
                },
                data: {
                    status: ContentVersionStatus.PUBLISHED,
                },
            });

            if (published.count !== 1) {
                throw new ContentEntryPublishError(
                    "Draft changed during publishing. Please retry.",
                    409,
                );
            }

            return tx.contentEntry.update({
                where: { id: entryId },
                data: {
                    status: ContentEntryStatus.PUBLISHED,
                    publishedVersionId: draft.id,
                    publishedAt: new Date(),
                },
                select: {
                    id: true,
                    modelId: true,
                    environmentId: true,
                    externalId: true,
                    slug: true,
                    status: true,
                    visibility: true,
                    accessMethod: true,
                    publishedAt: true,
                    currentDraftVersionId: true,
                    publishedVersionId: true,
                    createdAt: true,
                    updatedAt: true,
                    publishedVersion: {
                        select: {
                            id: true,
                            version: true,
                            schemaVersion: true,
                            snapshot: true,
                            status: true,
                            changeSummary: true,
                            createdAt: true,
                        },
                    },
                },
            });
        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
    );
}
