import { z } from "zod";
import { Visibility } from "@prisma/client";

export const CreatePortfolioSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1)
        .max(100),

    slug: z
        .string()
        .trim()
        .min(3)
        .max(50)
        .regex(/^[a-z0-9-]+$/, {
            message:
                "Slug may only contain lowercase letters, numbers and hyphens.",
        }),
});

export type CreatePortfolioInput =
    z.infer<typeof CreatePortfolioSchema>;


export const UpdatePortfolioSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

    visibility: z
        .nativeEnum(Visibility)
        .optional(),
});

export type UpdatePortfolioInput =
    z.infer<typeof CreatePortfolioSchema>;

