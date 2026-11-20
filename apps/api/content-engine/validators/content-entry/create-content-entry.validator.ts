
import { z } from "zod";

export const CreateContentEntrySchema = z.object({
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

    data: z.record(z.string(), z.unknown()),

    changeSummary: z.string().trim().max(500).nullable().optional(),
});

export type CreateContentEntryInput = z.infer<
    typeof CreateContentEntrySchema
>;
