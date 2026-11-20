
import { z } from "zod";

export const ApplicationCredentialScopeSchema = z.enum([
    "content.read",
    "content.write",
    "assets.read",
    "assets.write",
]);

export const CreateApplicationCredentialSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Credential name must be at least 2 characters.")
        .max(50, "Credential name must not exceed 50 characters."),

    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters.")
        .nullable()
        .optional(),

    scopes: z
        .array(ApplicationCredentialScopeSchema)
        .min(1, "At least one scope is required.")
        .max(4, "A maximum of 4 scopes is allowed.")
        .refine((scopes) => new Set(scopes).size === scopes.length, {
            message: "Duplicate scopes are not allowed.",
        }),

    expiresAt: z
        .string()
        .datetime({ offset: true })
        .nullable()
        .optional(),
});

export type CreateApplicationCredentialInput = z.infer<
    typeof CreateApplicationCredentialSchema
>;
