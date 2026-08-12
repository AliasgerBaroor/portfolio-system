import { Context, Next } from "hono";

import { prisma } from "../lib/prisma";

import {
    hashClientSessionToken,
} from "../utils/hash-client-session-token";

export async function clientAccessMiddleware(
    c: Context,
    next: Next
) {
    const authorization =
        c.req.header("Authorization");

    if (!authorization) {
        return c.json(
            {
                success: false,
                message:
                    "Client access required.",
            },
            401
        );
    }

    const [scheme, token] =
        authorization.split(" ");

    if (
        scheme !== "Bearer" ||
        !token
    ) {
        return c.json(
            {
                success: false,
                message:
                    "Invalid client access token.",
            },
            401
        );
    }

    const sessionTokenHash =
        hashClientSessionToken(token);

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

    if (
        session.expiresAt <= now ||
        session.accessKey.expiresAt <= now ||
        !session.accessKey.isActive ||
        session.accessKey.deletedAt !== null
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

    c.set(
        "clientAccessSession",
        session
    );

    await next();
}