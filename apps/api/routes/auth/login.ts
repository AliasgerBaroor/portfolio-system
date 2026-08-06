import { Hono } from "hono";

import { setCookie } from "hono/cookie";

import { LoginSchema } from "../../validators/auth";

import { loginUser } from "../../services/auth/login.service";

const login = new Hono();

login.post("/", async (c) => {
    try {
        const body = await c.req.json();
        const result = LoginSchema.safeParse(body);

        if (!result.success) {
            return c.json(
                {
                    success: false,
                    errors: result.error.flatten(),
                },
                400
            );
        }

        const { email, password } = result.data;

        const auth = await loginUser(
            email,
            password
        );

        setCookie(c, "refresh_token", auth.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        return c.json({
            success: true,
            accessToken: auth.accessToken,
            user: auth.user,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Login failed",
            },
            401
        );
    }
});

export default login;