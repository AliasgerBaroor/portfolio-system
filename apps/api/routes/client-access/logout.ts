import { Hono } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";

import { prisma } from "../../lib/prisma";

import {
    hashClientSessionToken,
} from "../../utils/hash-client-session-token";

const logout = new Hono();

logout.post("/", async (c) => {
    try {
        const sessionToken = getCookie(
            c,
            "client_access_session"
        );

        if (sessionToken) {
            const sessionTokenHash =
                hashClientSessionToken(
                    sessionToken
                );

            await prisma.clientAccessSession.deleteMany({
                where: {
                    sessionTokenHash,
                },
            });
        }

        deleteCookie(
            c,
            "client_access_session",
            {
                path: "/",
            }
        );

        return c.json({
            success: true,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to logout.",
            },
            500
        );
    }
});

export default logout;