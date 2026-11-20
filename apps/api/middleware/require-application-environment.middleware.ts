import type { Context, Next } from "hono";

export function requireApplicationEnvironment() {
    return async (c: Context, next: Next) => {
        const credential = c.get("applicationCredential");

        const requestedApplicationId = c.req.param("applicationId");
        const requestedEnvironmentId = c.req.param("environmentId");

        if (!requestedApplicationId || !requestedEnvironmentId) {
            return c.json(
                {
                    success: false,
                    message: "Application ID and environment ID are required.",
                },
                400
            );
        }

        if (
            credential.applicationId !== requestedApplicationId ||
            credential.environmentId !== requestedEnvironmentId
        ) {
            return c.json(
                {
                    success: false,
                    message: "Credential cannot access this application environment.",
                },
                403
            );
        }

        await next();
    };
}