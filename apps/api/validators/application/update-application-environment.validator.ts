import { z } from "zod";

export const UpdateApplicationEnvironmentSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Environment name must be at least 2 characters.")
            .max(50, "Environment name must not exceed 50 characters.")
            .optional(),

        description: z
            .string()
            .trim()
            .max(500, "Description must not exceed 500 characters.")
            .nullable()
            .optional(),

        status: z.enum(["ACTIVE", "DISABLED"]).optional(),
    })
    .refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        {
            message: "At least one field must be provided.",
        },
    );

export type UpdateApplicationEnvironmentInput = z.infer<
    typeof UpdateApplicationEnvironmentSchema
>;