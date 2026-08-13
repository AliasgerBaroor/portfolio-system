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

    /*
     * No valid access key matched
     */
    if (!matchedAccessKey) {
        const firstAccessRule =
            accessRules.at(0);

        if (firstAccessRule) {
            await prisma.clientAccessLog.create({
                data: {
                    accessKeyId:
                        firstAccessRule.accessKeyId,

                    fingerprint,
                    ip,
                    userAgent,
                    success: false,
                },
            });
        }

        throw new Error(
            "Invalid portfolio access."
        );
    }

    /*
     * From this point onward TypeScript knows
     * the access key exists.
     */
    const accessKey = matchedAccessKey;

    /*
     * Remove an existing session for this
     * same device so we can issue a fresh token.
     */
    const existingSession =
        await prisma.clientAccessSession.findUnique({
            where: {
                accessKeyId_fingerprint: {
                    accessKeyId:
                        accessKey.id,

                    fingerprint,
                },
            },
        });

    if (existingSession) {
        await prisma.clientAccessSession.delete({
            where: {
                id: existingSession.id,
            },
        });
    }

    /*
     * Check device limit.
     */
    const activeSessions =
        await prisma.clientAccessSession.count({
            where: {
                accessKeyId:
                    accessKey.id,

                expiresAt: {
                    gt: now,
                },
            },
        });

    if (
        activeSessions >=
        accessKey.deviceLimit
    ) {
        throw new Error(
            "This client password is already being used on another device."
        );
    }

    /*
     * Generate a new client session token.
     */
    const sessionToken =
        generateClientSessionToken();

    const sessionTokenHash =
        hashClientSessionToken(
            sessionToken
        );

    /*
     * Create session + audit log + usage update
     * atomically.
     */
    const session =
        await prisma.$transaction(
            async (tx) => {
                const createdSession =
                    await tx.clientAccessSession.create({
                        data: {
                            accessKeyId:
                                accessKey.id,

                            sessionTokenHash,

                            fingerprint,

                            ip,

                            userAgent,

                            expiresAt:
                                accessKey.expiresAt,
                        },
                    });

                await tx.clientAccessLog.create({
                    data: {
                        accessKeyId:
                            accessKey.id,

                        fingerprint,

                        ip,

                        userAgent,

                        success: true,
                    },
                });

                await tx.clientAccessKey.update({
                    where: {
                        id: accessKey.id,
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
        expiresAt:
            session.expiresAt,
    };
}