import { Hono } from "hono";

import { LoginClientAccessSchema } from "../../validators/login-client-access";
import { loginClientAccess } from "../../services/client-access-key/client-access.service";

const access = new Hono();

access.post("/:slug/access", async (c) => {
    try {
        const body = await c.req.json();

        const result =
            LoginClientAccessSchema.safeParse(body);

        if (!result.success) {
            return c.json(
                {
                    success: false,
                    errors: result.error.flatten(),
                },
                400
            );
        }

        const slug = c.req.param("slug");

        const response =
            await loginClientAccess(
                slug,
                result.data.password,
                result.data.fingerprint,
                c.req.header("x-forwarded-for"),
                c.req.header("user-agent")
            );

        return c.json({
            success: true,
            sessionToken:
                response.sessionToken,
            expiresAt:
                response.expiresAt,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to authenticate client.",
            },
            401
        );
    }
});

export default access;