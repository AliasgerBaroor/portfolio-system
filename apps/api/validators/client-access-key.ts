
import { z } from "zod";

export const CreateClientAccessKeySchema =
    z.object({
        clientId: z
            .string()
            .trim()
            .min(1, "Client ID is required."),

        portfolioId: z
            .string()
            .trim()
            .min(1, "Portfolio ID is required."),
    });
