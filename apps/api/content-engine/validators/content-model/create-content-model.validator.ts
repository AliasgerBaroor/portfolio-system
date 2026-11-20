
import { ContentFieldType } from "@prisma/client";
import { z } from "zod";

const fieldKeySchema = z
    .string()
    .min(1)
    .max(64)
    .regex(
        /^[a-z][a-z0-9_]*$/,
        "Field keys must start with a lowercase letter and contain only lowercase letters, numbers, and underscores.",
    );

const fieldSchema: z.ZodType<any> = z.lazy(() =>
    z.object({
        name: z.string().trim().min(1).max(100),
        key: fieldKeySchema,
        description: z.string().max(500).nullable().optional(),

        type: z.nativeEnum(ContentFieldType),

        isRequired: z.boolean().default(false),
        isUnique: z.boolean().default(false),
        isArray: z.boolean().default(false),

        defaultValue: z.unknown().optional(),
        validation: z.record(z.string(), z.unknown()).optional(),
        options: z.unknown().optional(),
        uiConfig: z.record(z.string(), z.unknown()).optional(),

        sortOrder: z.number().int().min(0).default(0),

        children: z.array(fieldSchema).default([]),
    }).superRefine((field, ctx) => {
        const hasChildren = field.children.length > 0;

        if (
            field.type !== ContentFieldType.OBJECT &&
            field.type !== ContentFieldType.ARRAY &&
            hasChildren
        ) {
            ctx.addIssue({
                code: "custom",
                message: "Only OBJECT and ARRAY fields can contain children.",
                path: ["children"],
            });
        }

        if (
            field.type === ContentFieldType.OBJECT &&
            field.isArray
        ) {
            ctx.addIssue({
                code: "custom",
                message: "OBJECT fields cannot use isArray. Use ARRAY for array containers.",
                path: ["isArray"],
            });
        }

        if (
            field.type === ContentFieldType.ARRAY &&
            field.isArray
        ) {
            ctx.addIssue({
                code: "custom",
                message: "ARRAY fields already represent arrays. Set isArray to false.",
                path: ["isArray"],
            });
        }

        const keys = field.children.map((child: any) => child.key);

        if (new Set(keys).size !== keys.length) {
            ctx.addIssue({
                code: "custom",
                message: "Child field keys must be unique among siblings.",
                path: ["children"],
            });
        }
    }),
);

export const CreateContentModelSchema = z.object({
    name: z.string().trim().min(2).max(100),

    slug: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain lowercase letters, numbers, and hyphens.",
        ),

    description: z.string().max(500).nullable().optional(),

    fields: z.array(fieldSchema).min(1).max(100),
}).superRefine((model, ctx) => {
    const keys = model.fields.map((field) => field.key);

    if (new Set(keys).size !== keys.length) {
        ctx.addIssue({
            code: "custom",
            message: "Root field keys must be unique.",
            path: ["fields"],
        });
    }
});

export type CreateContentModelInput = z.infer<
    typeof CreateContentModelSchema
>;
