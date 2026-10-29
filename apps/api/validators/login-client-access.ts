import { z } from "zod";

export const LoginClientAccessSchema =
    z.object({
        password: z
            .string()
            .trim()
            .min(1),

        fingerprint: z
            .string()
            .trim()
            .min(1)
            .max(255),

        credentialId: z
            .string()
            .trim()
            .min(1)
            .max(100),
    });