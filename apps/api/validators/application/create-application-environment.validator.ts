
import { z } from "zod";

export const CreateApplicationEnvironmentSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Environment name must be at least 2 characters.")
        .max(50, "Environment name must not exceed 50 characters."),

    type: z.literal("CUSTOM"),

    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters.")
        .nullable()
        .optional(),
});

export type CreateApplicationEnvironmentInput = z.infer<
    typeof CreateApplicationEnvironmentSchema
>;
