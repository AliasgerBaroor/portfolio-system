
import {
    Prisma,
} from "@prisma/client";

import { prisma } from "../../../lib/prisma";

export class ContentEntryDeleteError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404 | 409,
    ) {
        super(message);
        this.name = "ContentEntryDeleteError";
    }
}

export async function deleteContentEntry(
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
                throw new ContentEntryDeleteError(
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
                throw new ContentEntryDeleteError(
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
                throw new ContentEntryDeleteError(
                    "Active content model not found.",
                    404,
                );
            }

            // Serialize deletion with updates, publishing,
            // archiving and restoration of this entry.
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
                throw new ContentEntryDeleteError(
                    "Content entry not found or already deleted.",
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
                throw new ContentEntryDeleteError(
                    "Content entry not found or already deleted.",
                    404,
                );
            }

            const deletedAt = new Date();

            const deleted = await tx.contentEntry.updateMany({
                where: {
                    id: entryId,
                    modelId,
                    environmentId,
                    deletedAt: null,
                },
                data: {
                    deletedAt,
                },
            });

            if (deleted.count !== 1) {
                throw new ContentEntryDeleteError(
                    "Content entry changed during deletion. Please retry.",
                    409,
                );
            }

            // Release unique values so other entries can reuse them.
            // This is atomic with the soft deletion.
            await tx.contentEntryUniqueValue.deleteMany({
                where: {
                    environmentId,
                    modelId,
                    entryId,
                },
            });

            return {
                id: entry.id,
                modelId,
                environmentId,
                status: entry.status,
                deletedAt,
            };
        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
    );
}
