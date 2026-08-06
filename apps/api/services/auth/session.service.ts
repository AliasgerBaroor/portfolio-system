import { prisma } from "../../lib/prisma";
import { generateSessionTokens } from "../../lib/session";

export async function createSession(
    userId: string
) {
    const {
        refreshToken,
        refreshTokenHash,
        expiresAt,
    } = generateSessionTokens();

    const session = await prisma.session.create({
        data: {
            userId,
            refreshTokenHash,
            expiresAt,
            lastSeenAt: new Date(),
        },
    });

    return {
        session,
        refreshToken,
    };
}

export async function rotateSession(
    sessionId: string
) {
    const {
        refreshToken,
        refreshTokenHash,
        expiresAt,
    } = generateSessionTokens();

    const session = await prisma.session.update({
        where: {
            id: sessionId,
        },
        data: {
            refreshTokenHash,
            expiresAt,
            lastSeenAt: new Date(),
        },
    });

    return {
        session,
        refreshToken,
    };
}