
import type { Prisma } from "@prisma/client";

export type ContentFieldSchema = {
    id?: string;
    name: string;
    key: string;
    description?: string | null;
    type: string;
    isRequired: boolean;
    isUnique: boolean;
    isArray: boolean;
    defaultValue?: Prisma.JsonValue | null;
    validation?: Prisma.JsonValue;
    options?: Prisma.JsonValue;
    uiConfig?: Prisma.JsonValue;
    sortOrder: number;
    children: ContentFieldSchema[];
};

export type ContentModelSchema = {
    name: string;
    slug: string;
    description?: string | null;
    fields: ContentFieldSchema[];
};

export function buildContentModelSchema(
    model: ContentModelSchema,
): Prisma.InputJsonObject {
    return {
        name: model.name,
        slug: model.slug,
        description: model.description ?? null,
        fields: model.fields.map((field) => ({
            ...(field.id ? { id: field.id } : {}),
            name: field.name,
            key: field.key,
            description: field.description ?? null,
            type: field.type,
            isRequired: field.isRequired,
            isUnique: field.isUnique,
            isArray: field.isArray,
            ...(field.defaultValue !== undefined
                ? { defaultValue: field.defaultValue }
                : {}),
            ...(field.validation !== undefined
                ? { validation: field.validation }
                : {}),
            ...(field.options !== undefined
                ? { options: field.options }
                : {}),
            ...(field.uiConfig !== undefined
                ? { uiConfig: field.uiConfig }
                : {}),
            sortOrder: field.sortOrder,
            children: field.children.map((child) =>
                buildFieldSchema(child),
            ),
        })),
    };
}

function buildFieldSchema(
    field: ContentFieldSchema,
): Prisma.InputJsonObject {
    return {
        ...(field.id ? { id: field.id } : {}),
        name: field.name,
        key: field.key,
        description: field.description ?? null,
        type: field.type,
        isRequired: field.isRequired,
        isUnique: field.isUnique,
        isArray: field.isArray,
        ...(field.defaultValue !== undefined
            ? { defaultValue: field.defaultValue }
            : {}),
        ...(field.validation !== undefined
            ? { validation: field.validation }
            : {}),
        ...(field.options !== undefined
            ? { options: field.options }
            : {}),
        ...(field.uiConfig !== undefined
            ? { uiConfig: field.uiConfig }
            : {}),
        sortOrder: field.sortOrder,
        children: field.children.map(buildFieldSchema),
    };
}