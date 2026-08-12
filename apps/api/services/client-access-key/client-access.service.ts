import bcrypt from "bcrypt";

import { prisma } from "../../lib/prisma";

import {
    generateClientSessionToken,
} from "../../utils/generate-client-session-token";

import {
    hashClientSessionToken,
} from "../../utils/hash-client-session-token";

export async function loginClientAccess(
    portfolioSlug: string,
    password: string,
    fingerprint: string,
    ip?: string,
    userAgent?: string
) {
    const portfolio =
        await prisma.portfolio.findFirst({
            where: {
                slug: portfolioSlug,
                deletedAt: null,
                isPublished: true,
            },
        });

    if (!portfolio) {
        throw new Error(
            "Invalid portfolio access."
        );
    }

    const accessRules =
        await prisma.portfolioClientAccess.findMany({
            where: {
                portfolioId: portfolio.id,
            },
            include: {
                accessKey: true,
            },
        });

    const now = new Date();

    let matchedAccessKey = null;

    for (const rule of accessRules) {
        const accessKey = rule.accessKey;

        if (!accessKey.isActive) {
            continue;
        }

        if (
            accessKey.deletedAt !== null
        ) {
            continue;
        }

        if (
            accessKey.expiresAt <= now
        ) {
            continue;
        }

        const passwordMatches =
            await bcrypt.compare(
                password,
                accessKey.passwordHash
            );

        if (passwordMatches) {
            matchedAccessKey =
                accessKey;

            break;
        }
    }

    if (!matchedAccessKey) {
        await prisma.clientAccessLog.create({
            data: {
                accessKeyId:
                    accessRules[0]?.accessKeyId ?? "",
                fingerprint,
                ip,
                userAgent,
                success: false,
            },
        });

        throw new Error(
            "Invalid portfolio access."
        );
    }

    const existingSession =
        await prisma.clientAccessSession.findUnique({
            where: {
                accessKeyId_fingerprint: {
                    accessKeyId:
                        matchedAccessKey.id,
                    fingerprint,
                },
            },
        });

    if (existingSession) {
        if (
            existingSession.expiresAt > now
        ) {
            return {
                sessionToken: undefined,
                expiresAt:
                    existingSession.expiresAt,
            };
        }

        await prisma.clientAccessSession.delete({
            where: {
                id: existingSession.id,
            },
        });
    }

    const activeSessions =
        await prisma.clientAccessSession.count({
            where: {
                accessKeyId:
                    matchedAccessKey.id,
                expiresAt: {
                    gt: now,
                },
            },
        });

    if (
        activeSessions >=
        matchedAccessKey.deviceLimit
    ) {
        throw new Error(
            "This client password is already being used on another device."
        );
    }

    const sessionToken =
        generateClientSessionToken();

    const sessionTokenHash =
        hashClientSessionToken(
            sessionToken
        );

    const session =
        await prisma.$transaction(
            async (tx) => {
                const createdSession =
                    await tx.clientAccessSession.create({
                        data: {
                            accessKeyId:
                                matchedAccessKey!.id,

                            sessionTokenHash,

                            fingerprint,

                            ip,

                            userAgent,

                            expiresAt:
                                matchedAccessKey!.expiresAt,
                        },
                    });

                await tx.clientAccessLog.create({
                    data: {
                        accessKeyId:
                            matchedAccessKey!.id,

                        fingerprint,

                        ip,

                        userAgent,

                        success: true,
                    },
                });

                await tx.clientAccessKey.update({
                    where: {
                        id: matchedAccessKey!.id,
                    },

                    data: {
                        usedCount: {
                            increment: 1,
                        },

                        lastSeenAt: now,

                        lastUsedAt: now,
                    },
                });

                return createdSession;
            }
        );

    return {
        sessionToken,
        expiresAt: session.expiresAt,
    };
}