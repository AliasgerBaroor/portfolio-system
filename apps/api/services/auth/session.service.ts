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

export async function touchSession(
    sessionId: string,
    expectedRefreshTokenHash: string
) {
    const now = new Date();
    const expiresAt = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const result = await prisma.session.updateMany({
        where: {
            id: sessionId,
            refreshTokenHash: expectedRefreshTokenHash,
            expiresAt: {
                gt: now,
            },
        },
        data: {
            expiresAt,
            lastSeenAt: now,
        },
    });

    if (result.count !== 1) {
        throw new Error("Invalid refresh token.");
    }

    return prisma.session.findUniqueOrThrow({
        where: {
            id: sessionId,
        },
    });
}
