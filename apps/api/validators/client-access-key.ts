import { z } from "zod";

export const CreateClientAccessKeySchema =
    z.object({
        name: z
            .string()
            .trim()
            .min(1)
            .max(100),
    });