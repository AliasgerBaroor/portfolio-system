import { Context, Next } from "hono";

import { getCookie } from "hono/cookie";

import { prisma } from "../lib/prisma";

import {
    hashClientSessionToken,
} from "../utils/hash-client-session-token";

export async function clientAccessMiddleware(
    c: Context,
    next: Next
) {
    /*
     * --------------------------------------------------
     * 1. Read HttpOnly session cookie
     * --------------------------------------------------
     */

    const sessionToken =
        getCookie(
            c,
            "client_access_session"
        );

    if (!sessionToken) {
        return c.json(
            {
                success: false,

                message:
                    "Client access required.",
            },
            401
        );
    }

    /*
     * --------------------------------------------------
     * 2. Hash the raw token
     * --------------------------------------------------
     */

    const sessionTokenHash =
        hashClientSessionToken(
            sessionToken
        );

    /*
     * --------------------------------------------------
     * 3. Find current browser session
     * --------------------------------------------------
     */

    const session =
        await prisma.clientAccessSession.findFirst({
            where: {
                sessionTokenHash,
            },

            include: {
                accessKey: true,
            },
        });

    if (!session) {
        return c.json(
            {
                success: false,

                message:
                    "Invalid client session.",
            },
            401
        );
    }

    const now = new Date();

    /*
     * --------------------------------------------------
     * 4. Validate SESSION lifetime
     * --------------------------------------------------
     *
     * This is the primary browser/device lifetime.
     */

    if (
        session.expiresAt <= now
    ) {
        return c.json(
            {
                success: false,

                message:
                    "Client session has expired.",
            },
            401
        );
    }

    /*
     * --------------------------------------------------
     * 5. Validate ACCESS KEY lifetime/state
     * --------------------------------------------------
     *
     * Even if the session itself has time remaining,
     * the underlying access key can revoke access.
     */

    if (
        session.accessKey.expiresAt <= now
    ) {
        return c.json(
            {
                success: false,

                message:
                    "Client access has expired.",
            },
            401
        );
    }

    if (
        !session.accessKey.isActive ||
        session.accessKey.deletedAt !== null
    ) {
        return c.json(
            {
                success: false,

                message:
                    "Client access has been revoked.",
            },
            401
        );
    }

    /*
     * --------------------------------------------------
     * 6. Attach authenticated session
     * --------------------------------------------------
     */

    c.set(
        "clientAccessSession",
        session
    );

    await next();
}