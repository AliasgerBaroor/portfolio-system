
import { ContentFieldType } from "@prisma/client";
import type { CreateContentModelInput } from "../../validators/content-model/create-content-model.validator";

type ContentFieldInput = CreateContentModelInput["fields"][number];

export function validateContentFieldHierarchy(
    fields: ContentFieldInput[],
    path = "fields",
): void {
    const siblingKeys = new Set<string>();

    for (const [index, field] of fields.entries()) {
        const fieldPath = `${path}[${index}]`;

        if (siblingKeys.has(field.key)) {
            throw new Error(
                `Duplicate field key "${field.key}" at ${fieldPath}.`,
            );
        }

        siblingKeys.add(field.key);

        const hasChildren = field.children.length > 0;

        if (
            hasChildren &&
            field.type !== ContentFieldType.OBJECT &&
            field.type !== ContentFieldType.ARRAY
        ) {
            throw new Error(
                `Field "${field.key}" cannot contain child fields.`,
            );
        }

        if (
            field.type === ContentFieldType.OBJECT &&
            field.isArray
        ) {
            throw new Error(
                `OBJECT field "${field.key}" cannot be an array.`,
            );
        }

        if (
            field.type === ContentFieldType.ARRAY &&
            field.isArray
        ) {
            throw new Error(
                `ARRAY field "${field.key}" must have isArray set to false.`,
            );
        }

        if (field.type === ContentFieldType.ARRAY && !hasChildren) {
            throw new Error(
                `ARRAY field "${field.key}" must define its item structure using children.`,
            );
        }

        if (hasChildren) {
            validateContentFieldHierarchy(
                field.children,
                `${fieldPath}.children`,
            );
        }
    }
}