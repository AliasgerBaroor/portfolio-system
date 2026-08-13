import { z } from "zod";

export const CreateClientSchema =
    z.object({
        name: z
            .string()
            .trim()
            .min(1)
            .max(100),

        company: z
            .string()
            .trim()
            .max(100)
            .optional(),

        email: z
            .string()
            .trim()
            .email()
            .max(255)
            .optional(),
    });

export type CreateClientInput =
    z.infer<typeof CreateClientSchema>;