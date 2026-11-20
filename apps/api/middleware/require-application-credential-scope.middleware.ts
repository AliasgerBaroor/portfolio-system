import type { Context, Next } from "hono";

import type { ApplicationCredentialScope } from "../types/hono";

export function requireApplicationCredentialScope(
    requiredScope: ApplicationCredentialScope
) {
    return async (c: Context, next: Next) => {
        const credential = c.get("applicationCredential");

        if (!credential) {
            return c.json(
                {
                    success: false,
                    message: "Application authentication is required.",
                },
                401
            );
        }

        if (!credential.scopes.includes(requiredScope)) {
            return c.json(
                {
                    success: false,
                    message: "Insufficient application credential scope.",
                },
                403
            );
        }

        await next();
    };
}