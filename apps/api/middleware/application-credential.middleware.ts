
import type { Context, Next } from "hono";

import { prisma } from "../lib/prisma";
import { hashApplicationCredential } from "../lib/application-credential";

import type {
    ApplicationCredentialScope,
} from "../types/hono";

const ALLOWED_SCOPES: readonly ApplicationCredentialScope[] = [
    "content.read",
    "content.write",
    "assets.read",
    "assets.write",
];

function isApplicationCredentialScope(
    value: unknown
): value is ApplicationCredentialScope {
    return (
        typeof value === "string" &&
        ALLOWED_SCOPES.includes(value as ApplicationCredentialScope)
    );
}

export async function applicationCredentialMiddleware(
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

    const [scheme, secret, ...extra] = authorization.split(" ");

    if (
        scheme !== "Bearer" ||
        !secret ||
        extra.length > 0
    ) {
        return c.json(
            {
                success: false,
                message: "Invalid authorization header.",
            },
            401
        );
    }

    // Application credentials use a separate prefix from user JWTs.
    if (!secret.startsWith("lgfx_")) {
        return c.json(
            {
                success: false,
                message: "Invalid application credential.",
            },
            401
        );
    }

    const secretHash = hashApplicationCredential(secret);

    const credential = await prisma.applicationCredential.findUnique({
        where: {
            secretHash,
        },
        select: {
            id: true,
            environmentId: true,
            scopes: true,
            expiresAt: true,
            revokedAt: true,
            environment: {
                select: {
                    id: true,
                    applicationId: true,
                    status: true,
                    deletedAt: true,
                    application: {
                        select: {
                            id: true,
                            status: true,
                            deletedAt: true,
                        },
                    },
                },
            },
        },
    });

    if (!credential || credential.revokedAt) {
        return c.json(
            {
                success: false,
                message: "Invalid application credential.",
            },
            401
        );
    }

    const now = new Date();

    if (
        credential.expiresAt &&
        credential.expiresAt <= now
    ) {
        return c.json(
            {
                success: false,
                message: "Application credential has expired.",
            },
            401
        );
    }

    const environment = credential.environment;
    const application = environment.application;

    if (
        environment.status !== "ACTIVE" ||
        environment.deletedAt ||
        application.status !== "ACTIVE" ||
        application.deletedAt
    ) {
        return c.json(
            {
                success: false,
                message: "Application environment is unavailable.",
            },
            403
        );
    }

    if (
        !Array.isArray(credential.scopes) ||
        !credential.scopes.every(isApplicationCredentialScope)
    ) {
        return c.json(
            {
                success: false,
                message: "Application credential has invalid scopes.",
            },
            403
        );
    }

    // Guard against revocation or expiration between lookup and usage.
    const usageUpdate = await prisma.applicationCredential.updateMany({
        where: {
            id: credential.id,
            revokedAt: null,
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: now } },
            ],
        },
        data: {
            lastUsedAt: now,
        },
    });

    if (usageUpdate.count !== 1) {
        return c.json(
            {
                success: false,
                message: "Invalid application credential.",
            },
            401
        );
    }

    c.set("applicationCredential", {
        id: credential.id,
        environmentId: environment.id,
        applicationId: application.id,
        scopes: credential.scopes,
    });

    await next();
}
