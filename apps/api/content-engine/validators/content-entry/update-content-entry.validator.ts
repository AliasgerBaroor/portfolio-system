
import { z } from "zod";

export const UpdateContentEntrySchema = z.object({
    externalId: z.string().trim().min(1).max(255).nullable().optional(),

    slug: z
        .string()
        .trim()
        .min(1)
        .max(255)
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain lowercase letters, numbers, and hyphens.",
        )
        .nullable()
        .optional(),

    data: z.record(z.string(), z.unknown()).optional(),

    changeSummary: z.string().trim().max(500).nullable().optional(),
}).refine(
    (input) =>
        input.externalId !== undefined ||
        input.slug !== undefined ||
        input.data !== undefined ||
        input.changeSummary !== undefined,
    {
        message: "At least one field must be provided for an update.",
    },
);

export type UpdateContentEntryInput = z.infer<
    typeof UpdateContentEntrySchema
>;
