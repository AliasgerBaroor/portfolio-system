
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

import type { CreateContentEntryInput } from "../../validators/content-entry/create-content-entry.validator";

type FieldRow = {
    id: string;
    parentId: string | null;
    key: string;
    type: ContentFieldType;
    isRequired: boolean;
    isUnique: boolean;
    isArray: boolean;
    defaultValue: Prisma.JsonValue | null;
    options: Prisma.JsonValue | null;
};

export class ContentEntryCreationError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404 | 409,
    ) {
        super(message);
        this.name = "ContentEntryCreationError";
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
            options: row.options ?? undefined,
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
                throw new ContentEntryCreationError(
                    `Unique field "${field.key}" must be a scalar field.`,
                    400,
                );
            }

            const serialized = JSON.stringify(value);

            result.push({
                fieldId: field.id,
                value: value as Prisma.InputJsonValue,
                valueHash: hashToken(serialized),
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

export async function createContentEntry(
    applicationId: string,
    environmentId: string,
    modelId: string,
    input: CreateContentEntryInput,
) {
    return prisma.$transaction(async (tx) => {
        const application = await tx.application.findFirst({
            where: {
                id: applicationId,
                status: "ACTIVE",
                deletedAt: null,
            },
            select: { id: true },
        });

        if (!application) {
            throw new ContentEntryCreationError(
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
            throw new ContentEntryCreationError(
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
            throw new ContentEntryCreationError(
                "Active content model not found.",
                404,
            );
        }

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
                options: true,
            },
        });

        const fields = buildFieldTree(fieldRows);

        const validation = validateContentEntryData(
            fields,
            input.data,
        );

        if (validation.errors.length > 0) {
            throw new ContentEntryCreationError(
                validation.errors.join(" "),
                400,
            );
        }

        const uniqueValues = collectUniqueValues(
            fields,
            validation.data,
        );

        const entry = await tx.contentEntry.create({
            data: {
                modelId,
                environmentId,
                externalId: input.externalId ?? null,
                slug: input.slug ?? null,
                status: ContentEntryStatus.DRAFT,
            },
        });

        if (uniqueValues.length > 0) {
            await tx.contentEntryUniqueValue.createMany({
                data: uniqueValues.map((item) => ({
                    environmentId,
                    modelId,
                    entryId: entry.id,
                    fieldId: item.fieldId,
                    value: item.value,
                    valueHash: item.valueHash,
                })),
            });
        }

        const version = await tx.contentVersion.create({
            data: {
                entryId: entry.id,
                modelId,
                version: 1,
                schemaVersion: model.schemaVersion,
                snapshot: validation.data as Prisma.InputJsonObject,
                status: ContentVersionStatus.DRAFT,
                changeSummary: input.changeSummary ?? "Initial draft.",
            },
        });

        const updatedEntry = await tx.contentEntry.update({
            where: { id: entry.id },
            data: {
                currentDraftVersionId: version.id,
            },
            select: {
                id: true,
                modelId: true,
                environmentId: true,
                externalId: true,
                slug: true,
                status: true,
                archivedFromStatus: true,
                visibility: true,
                accessMethod: true,
                publishedAt: true,
                currentDraftVersionId: true,
                publishedVersionId: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
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
    });
}
