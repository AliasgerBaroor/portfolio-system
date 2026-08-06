import { z } from "zod";

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