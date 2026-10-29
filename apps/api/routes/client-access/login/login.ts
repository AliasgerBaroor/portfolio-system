import { Hono } from "hono";

import {
    LoginClientAccessSchema,
} from "../../../validators/login-client-access";

import {
    loginClientAccess,
} from "../../../services/client-access-key/client-access.service";

import { setCookie } from "hono/cookie";

const login = new Hono();

login.post("/", async (c) => {
    try {
        const body =
            await c.req.json();

        const result =
            LoginClientAccessSchema.safeParse(
                body
            );

        if (!result.success) {
            return c.json(
                {
                    success: false,

                    errors:
                        result.error.flatten(),
                },
                400
            );
        }

        const portfolioSlug =
            c.req.param("slug");

        if (!portfolioSlug) {
            return c.json(
                {
                    success: false,

                    message:
                        "Portfolio slug is required.",
                },
                400
            );
        }

        const response =
            await loginClientAccess(
                portfolioSlug,

                result.data.password,

                result.data.fingerprint,

                result.data.credentialId,

                c.req.header(
                    "x-forwarded-for"
                ),

                c.req.header(
                    "user-agent"
                )
            );

        /*
         * The raw session token NEVER goes
         * into the frontend JavaScript.
         *
         * It lives inside this HttpOnly cookie.
         */

        setCookie(
            c,
            "client_access_session",
            response.sessionToken,
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite: "Lax",

                path: "/",

                expires:
                    response.expiresAt,
            }
        );

        /*
         * Only safe session information
         * is returned to the frontend.
         */

        return c.json({
            success: true,

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

export default login;