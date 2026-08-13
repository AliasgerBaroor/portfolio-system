import { z } from "zod";

export const CreateClientAccessKeySchema =
    z.object({
        clientId: z
            .string()
            .trim()
            .min(1),
    });