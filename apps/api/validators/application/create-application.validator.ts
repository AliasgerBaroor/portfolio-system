import { z } from "zod";
import {
    ApplicationIntegrationMode,
    ApplicationType,
} from "@prisma/client";

export const CreateApplicationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Application name must be at least 2 characters.")
        .max(80, "Application name cannot exceed 80 characters."),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters.")
        .optional(),

    type: z.nativeEnum(ApplicationType),

    integrationMode: z
        .nativeEnum(ApplicationIntegrationMode)
        .default(ApplicationIntegrationMode.MANAGED),
});

export type CreateApplicationInput = z.infer<
    typeof CreateApplicationSchema
>;