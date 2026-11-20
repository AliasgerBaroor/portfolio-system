import { z } from "zod";
import {
    ApplicationIntegrationMode,
    ApplicationType,
} from "@prisma/client";

export const UpdateApplicationSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Application name must be at least 2 characters.")
            .max(80, "Application name cannot exceed 80 characters.")
            .optional(),

        description: z
            .string()
            .trim()
            .max(500, "Description cannot exceed 500 characters.")
            .nullable()
            .optional(),

        type: z.nativeEnum(ApplicationType).optional(),

        integrationMode: z
            .nativeEnum(ApplicationIntegrationMode)
            .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        "At least one field must be provided.",
    );

export type UpdateApplicationInput = z.infer<
    typeof UpdateApplicationSchema
>;