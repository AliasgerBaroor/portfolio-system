
import {
    ContentEntryStatus,
    ContentFieldType,
    ContentVersionStatus,
    Prisma,
} from "@prisma/client";

import { prisma } from "../../../lib/prisma";
import { hashToken } from "../../../lib/hash";

import {
    validateContentEntryData,
    type ContentFieldDefinition,
} from "../../domain/content-entry/content-entry.rules";

import type { UpdateContentEntryInput } from "../../validators/content-entry/update-content-entry.validator";

type FieldRow = {
    id: string;
    parentId: string | null;
    key: string;
    type: ContentFieldType;
    isRequired: boolean;
    isUnique: boolean;
    isArray: boolean;
    defaultValue: Prisma.JsonValue | null;
};

export class ContentEntryUpdateError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404 | 409,
    ) {
        super(message);
        this.name = "ContentEntryUpdateError";
    }
}

function buildFieldTree(rows: FieldRow[]): ContentFieldDefinition[] {
    const nodes = new Map<string, ContentFieldDefinition>();

    for (const row of rows) {
        nodes.set(row.id, {
            id: row.id,
            parentId: row.parentId,
            key: row.key,
            type: row.type,
            isRequired: row.isRequired,
            isUnique: row.isUnique,
            isArray: row.isArray,
            defaultValue: row.defaultValue ?? undefined,
            children: [],
        });
    }

    const roots: ContentFieldDefinition[] = [];

    for (const node of nodes.values()) {
        if (node.parentId === null) {
            roots.push(node);
            continue;
        }

        const parent = nodes.get(node.parentId);

        if (!parent) {
            throw new Error(
                `Content field parent "${node.parentId}" was not found.`,
            );
        }

        parent.children.push(node);
    }

    return roots;
}

function collectUniqueValues(
    fields: ContentFieldDefinition[],
    data: Record<string, unknown>,
): Array<{
    fieldId: string;
    value: Prisma.InputJsonValue;
    valueHash: string;
}> {
    const result: Array<{
        fieldId: string;
        value: Prisma.InputJsonValue;
        valueHash: string;
    }> = [];

    for (const field of fields) {
        const value = data[field.key];

        if (value === undefined || value === null) {
            continue;
        }

        if (field.isUnique) {
            if (
                field.type === ContentFieldType.OBJECT ||
                field.type === ContentFieldType.ARRAY ||
                field.isArray
            ) {
                throw new ContentEntryUpdateError(
                    `Unique field "${field.key}" must be a scalar field.`,
                    400,
                );
            }

            result.push({
                fieldId: field.id,
                value: value as Prisma.InputJsonValue,
                valueHash: hashToken(JSON.stringify(value)),
            });
        }

        if (
            field.type === ContentFieldType.OBJECT &&
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
        ) {
            result.push(
                ...collectUniqueValues(
                    field.children,
                    value as Record<string, unknown>,
                ),
            );
        }

        if (field.type === ContentFieldType.ARRAY && Array.isArray(value)) {
            for (const item of value) {
                if (
                    typeof item === "object" &&
                    item !== null &&
                    !Array.isArray(item)
                ) {
                    result.push(
                        ...collectUniqueValues(
                            field.children,
                            item as Record<string, unknown>,
                        ),
                    );
                }
            }
        }
    }

    return result;
}

export async function updateContentEntry(
    applicationId: string,
    environmentId: string,
    modelId: string,
    entryId: string,
    input: UpdateContentEntryInput,
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
                throw new ContentEntryUpdateError(
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
                throw new ContentEntryUpdateError(
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
                select: {
                    id: true,
                    schemaVersion: true,
                },
            });

            if (!model) {
                throw new ContentEntryUpdateError(
                    "Active content model not found.",
                    404,
                );
            }

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
                throw new ContentEntryUpdateError(
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
                    externalId: true,
                    slug: true,
                    currentDraftVersion: {
                        select: {
                            id: true,
                            snapshot: true,
                        },
                    },
                    publishedVersion: {
                        select: {
                            snapshot: true,
                        },
                    },
                },
            });

            if (!entry) {
                throw new ContentEntryUpdateError(
                    "Content entry not found.",
                    404,
                );
            }

            if (entry.status === ContentEntryStatus.ARCHIVED) {
                throw new ContentEntryUpdateError(
                    "Archived content entries cannot be updated.",
                    409,
                );
            }

            const baseSnapshot =
                entry.currentDraftVersion?.snapshot ??
                entry.publishedVersion?.snapshot;

            if (
                baseSnapshot === null ||
                baseSnapshot === undefined ||
                typeof baseSnapshot !== "object" ||
                Array.isArray(baseSnapshot)
            ) {
                throw new ContentEntryUpdateError(
                    "Content entry has no valid version to update.",
                    409,
                );
            }

            const existingData = baseSnapshot as Record<string, unknown>;

            const mergedData = {
                ...existingData,
                ...(input.data ?? {}),
            };

            const fieldRows = await tx.contentField.findMany({
                where: { modelId },
                orderBy: { sortOrder: "asc" },
                select: {
                    id: true,
                    parentId: true,
                    key: true,
                    type: true,
                    isRequired: true,
                    isUnique: true,
                    isArray: true,
                    defaultValue: true,
                },
            });

            const fields = buildFieldTree(fieldRows);

            const validation = validateContentEntryData(
                fields,
                mergedData,
            );

            if (validation.errors.length > 0) {
                throw new ContentEntryUpdateError(
                    validation.errors.join(" "),
                    400,
                );
            }

            const uniqueValues = collectUniqueValues(
                fields,
                validation.data,
            );

            // Remove this entry's old unique values before inserting
            // the values derived from its updated snapshot.
            await tx.contentEntryUniqueValue.deleteMany({
                where: {
                    environmentId,
                    modelId,
                    entryId,
                },
            });

            if (uniqueValues.length > 0) {
                await tx.contentEntryUniqueValue.createMany({
                    data: uniqueValues.map((item) => ({
                        environmentId,
                        modelId,
                        entryId,
                        fieldId: item.fieldId,
                        value: item.value,
                        valueHash: item.valueHash,
                    })),
                });
            }

            const latestVersion = await tx.contentVersion.aggregate({
                where: { entryId },
                _max: { version: true },
            });

            const nextVersion = (latestVersion._max.version ?? 0) + 1;

            if (entry.currentDraftVersion) {
                const superseded = await tx.contentVersion.updateMany({
                    where: {
                        id: entry.currentDraftVersion.id,
                        entryId,
                        status: ContentVersionStatus.DRAFT,
                    },
                    data: {
                        status: ContentVersionStatus.SUPERSEDED,
                    },
                });

                if (superseded.count !== 1) {
                    throw new ContentEntryUpdateError(
                        "The current draft changed. Please retry the update.",
                        409,
                    );
                }
            }

            const version = await tx.contentVersion.create({
                data: {
                    entryId,
                    modelId,
                    version: nextVersion,
                    schemaVersion: model.schemaVersion,
                    snapshot: validation.data as Prisma.InputJsonObject,
                    status: ContentVersionStatus.DRAFT,
                    changeSummary:
                        input.changeSummary ?? "Content entry updated.",
                },
            });

            const updatedEntry = await tx.contentEntry.update({
                where: { id: entryId },
                data: {
                    ...(input.externalId !== undefined
                        ? { externalId: input.externalId }
                        : {}),
                    ...(input.slug !== undefined
                        ? { slug: input.slug }
                        : {}),
                    currentDraftVersionId: version.id,
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
                    currentDraftVersion: {
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

            return updatedEntry;
        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
    );
}
