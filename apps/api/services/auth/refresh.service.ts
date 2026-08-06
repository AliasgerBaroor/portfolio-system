import { prisma } from "../../lib/prisma";
import { hashToken } from "../../lib/hash";
import { signAccessToken } from "../../lib/jwt";

import { rotateSession } from "./session.service";

export async function refreshUserSession(
    refreshToken: string
) {
    const refreshTokenHash = hashToken(refreshToken);

    const existingSession = await prisma.session.findUnique({
        where: {
            refreshTokenHash,
        },
        include: {
            user: true,
        },
    });

    if (!existingSession) {
        throw new Error("Invalid refresh token.");
    }

    if (existingSession.expiresAt < new Date()) {
        await prisma.session.delete({
            where: {
                id: existingSession.id,
            },
        });

        throw new Error("Session expired.");
    }

    if (!existingSession.user.isActive) {
        throw new Error("Account disabled.");
    }

    const {
        session,
        refreshToken: newRefreshToken,
    } = await rotateSession(existingSession.id);

    const accessToken = signAccessToken({
        userId: existingSession.user.id,
        role: existingSession.user.role,
    });

    return {
        accessToken,

        refreshToken: newRefreshToken,

        sessionId: session.id,

        user: {
            id: existingSession.user.id,
            email: existingSession.user.email,
            displayName: existingSession.user.displayName,
            role: existingSession.user.role,
        },
    };
}