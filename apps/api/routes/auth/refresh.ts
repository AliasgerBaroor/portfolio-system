import { Hono } from "hono";

import { getCookie } from "hono/cookie";

import { refreshUserSession } from "../../services/auth/refresh.service";
import { setRefreshCookie } from "../../lib/cookies";

const refresh = new Hono();

refresh.post("/", async (c) => {
    try {
        const refreshToken = getCookie(
            c,
            "refresh_token"
        );

        if (!refreshToken) {
            return c.json(
                {
                    success: false,
                    message: "Missing refresh token.",
                },
                401
            );
        }

        const auth =
            await refreshUserSession(refreshToken);

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
                        : "Refresh failed.",
            },
            401
        );
    }
});

export default refresh;