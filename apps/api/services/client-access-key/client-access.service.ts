import bcrypt from "bcrypt";

import { prisma } from "../../lib/prisma";

import {
    generateClientSessionToken,
} from "../../utils/generate-client-session-token";

import {
    hashClientSessionToken,
} from "../../utils/hash-client-session-token";

/*
 * A browser/device session lasts for 24 hours.
 *
 * This is the SESSION lifetime.
 *
 * ClientAccessKey.expiresAt is still the
 * maximum lifetime of the credential itself.
 */
const CLIENT_SESSION_LIFETIME_MS =
    24 * 60 * 60 * 1000;

export async function loginClientAccess(
    portfolioSlug: string,
    password: string,
    fingerprint: string,
    credentialId: string,
    ip?: string,
    userAgent?: string
) {
    /*
     * --------------------------------------------------
     * 1. Find the portfolio
     * --------------------------------------------------
     */

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

    const now = new Date();

    /*
     * --------------------------------------------------
     * 2. Find the ClientAccessKey
     * --------------------------------------------------
     *
     * The credentialId identifies the long-lived
     * access configuration.
     *
     * The key must:
     *
     * - belong to this portfolio
     * - be active
     * - not be deleted
     * - not be expired
     */

    const accessKey =
        await prisma.clientAccessKey.findFirst({
            where: {
                credentialId,

                isActive: true,

                deletedAt: null,

                expiresAt: {
                    gt: now,
                },

                portfolios: {
                    some: {
                        portfolioId:
                            portfolio.id,
                    },
                },
            },
        });

    if (!accessKey) {
        throw new Error(
            "Invalid portfolio access."
        );
    }

    /*
     * --------------------------------------------------
     * 3. Verify password
     * --------------------------------------------------
     */

    const passwordMatches =
        await bcrypt.compare(
            password,
            accessKey.passwordHash
        );

    if (!passwordMatches) {
        await prisma.clientAccessLog.create({
            data: {
                accessKeyId:
                    accessKey.id,

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

    /*
     * --------------------------------------------------
     * 4. Remove existing session for this device
     * --------------------------------------------------
     *
     * Because:
     *
     * @@unique([accessKeyId, fingerprint])
     *
     * only one active session can exist for this
     * access key + device combination.
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
     * --------------------------------------------------
     * 5. Check device limit
     * --------------------------------------------------
     *
     * Only sessions that have not expired count.
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
     * --------------------------------------------------
     * 6. Calculate SESSION expiration
     * --------------------------------------------------
     *
     * Normal session:
     *
     *     now + 24 hours
     *
     * BUT:
     *
     *     session must NEVER outlive the
     *     ClientAccessKey.
     *
     * Therefore:
     *
     * session.expiresAt =
     *     min(
     *         now + 24 hours,
     *         accessKey.expiresAt
     *     )
     */

    const requestedSessionExpiry =
        new Date(
            now.getTime() +
            CLIENT_SESSION_LIFETIME_MS
        );

    const sessionExpiresAt =
        requestedSessionExpiry <
            accessKey.expiresAt
            ? requestedSessionExpiry
            : accessKey.expiresAt;

    /*
     * --------------------------------------------------
     * 7. Generate session token
     * --------------------------------------------------
     *
     * The RAW token is only used to create the
     * HttpOnly cookie.
     *
     * We store ONLY the hash in the database.
     */

    const sessionToken =
        generateClientSessionToken();

    const sessionTokenHash =
        hashClientSessionToken(
            sessionToken
        );

    /*
     * --------------------------------------------------
     * 8. Create session + audit log + usage update
     * --------------------------------------------------
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

                            /*
                             * IMPORTANT:
                             *
                             * This is now the actual
                             * browser/device session
                             * expiration.
                             */
                            expiresAt:
                                sessionExpiresAt,
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

    /*
     * --------------------------------------------------
     * 9. Return safe session information
     * --------------------------------------------------
     *
     * sessionToken will be consumed by the backend
     * route and placed into an HttpOnly cookie.
     *
     * The frontend receives expiresAt only.
     */

    return {
        sessionToken,

        expiresAt:
            session.expiresAt,
    };
}