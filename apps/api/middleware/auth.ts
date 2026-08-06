import type { Context, Next } from "hono";
import { verifyAccessToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";
import { authUserSelect } from "../lib/prisma-select";

export async function authMiddleware(
    c: Context,
    next: Next
) {
    const authorization = c.req.header("Authorization");

    if (!authorization) {
        return c.json(
            {
                success: false,
                message: "Authorization header is required.",
            },
            401
        );
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        return c.json(
            {
                success: false,
                message: "Invalid authorization header.",
            },
            401
        );
    }

    try {
        const payload = verifyAccessToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: payload.userId,
            },
            select: authUserSelect,
        });

        if (!user) {
            return c.json(
                {
                    success: false,
                    message: "User not found.",
                },
                401
            );
        }

        if (!user.isActive || user.deletedAt) {
            return c.json(
                {
                    success: false,
                    message: "Account disabled.",
                },
                403
            );
        }

        c.set("user", user);

        await next();
    } catch {
        return c.json(
            {
                success: false,
                message: "Invalid or expired access token.",
            },
            401
        );
    }
}