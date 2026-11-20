
import {
    ContentFieldType,
    Prisma,
} from "@prisma/client";

import { prisma } from "../../../lib/prisma";
import type { CreateContentModelInput } from "../../validators/content-model/create-content-model.validator";
import { validateContentFieldHierarchy } from "../../domain/content-model/content-model.rules";
import {
    buildContentModelSchema,
    type ContentFieldSchema,
} from "./content-model.mapper";

type FieldInput = CreateContentModelInput["fields"][number];

function toJsonInput(
    value: unknown,
): Prisma.InputJsonValue | typeof Prisma.JsonNull {
    if (value === null) {
        return Prisma.JsonNull;
    }

    return value as Prisma.InputJsonValue;
}

async function createFieldTree(
    tx: Prisma.TransactionClient,
    modelId: string,
    fields: FieldInput[],
    parentId: string | null = null,
): Promise<ContentFieldSchema[]> {
    const createdFields: ContentFieldSchema[] = [];

    for (const field of fields) {
        const created = await tx.contentField.create({
            data: {
                modelId,
                parentId,
                name: field.name,
                key: field.key,
                description: field.description ?? null,
                type: field.type,
                isRequired: field.isRequired,
                isUnique: field.isUnique,
                isArray: field.isArray,
                ...(field.defaultValue !== undefined
                    ? { defaultValue: toJsonInput(field.defaultValue) }
                    : {}),
                validation:
                    field.validation !== undefined
                        ? toJsonInput(field.validation)
                        : undefined,
                options:
                    field.options !== undefined
                        ? toJsonInput(field.options)
                        : undefined,
                uiConfig:
                    field.uiConfig !== undefined
                        ? toJsonInput(field.uiConfig)
                        : undefined,
                sortOrder: field.sortOrder,
            },
        });

        const children =
            field.children.length > 0
                ? await createFieldTree(
                    tx,
                    modelId,
                    field.children,
                    created.id,
                )
                : [];

        createdFields.push({
            id: created.id,
            name: created.name,
            key: created.key,
            description: created.description,
            type: created.type,
            isRequired: created.isRequired,
            isUnique: created.isUnique,
            isArray: created.isArray,
            ...(field.defaultValue !== undefined
                ? { defaultValue: field.defaultValue as Prisma.JsonValue }
                : {}),
            validation: created.validation ?? undefined,
            options: created.options ?? undefined,
            uiConfig: created.uiConfig ?? undefined,
            sortOrder: created.sortOrder,
            children,
        });
    }

    return createdFields;
}

export async function createContentModel(
    applicationId: string,
    createdById: string,
    input: CreateContentModelInput,
) {
    validateContentFieldHierarchy(input.fields);

    return prisma.$transaction(async (tx) => {
        const model = await tx.contentModel.create({
            data: {
                applicationId,
                name: input.name,
                slug: input.slug,
                description: input.description ?? null,
                schemaVersion: 1,
            },
        });

        const fields = await createFieldTree(
            tx,
            model.id,
            input.fields,
        );

        const schema = buildContentModelSchema({
            name: model.name,
            slug: model.slug,
            description: model.description,
            fields,
        });

        const schemaVersion = await tx.contentModelVersion.create({
            data: {
                modelId: model.id,
                version: 1,
                schema,
                createdById,
                changeSummary: "Initial content model schema.",
            },
        });

        return {
            ...model,
            fields,
            schemaVersion,
        };
    });
}
