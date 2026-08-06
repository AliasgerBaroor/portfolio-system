import { Hono } from "hono";
import { getCookie, deleteCookie } from "hono/cookie";

import { logoutUser } from "../../services/auth/logout.service";

const logout = new Hono();

logout.post("/", async (c) => {
    try {
        const refreshToken = getCookie(
            c,
            "refresh_token"
        );

        if (refreshToken) {
            await logoutUser(refreshToken);
        }

        deleteCookie(c, "refresh_token", {
            path: "/",
        });

        return c.json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch {
        return c.json(
            {
                success: false,
                message: "Logout failed.",
            },
            500
        );
    }
});

export default logout;