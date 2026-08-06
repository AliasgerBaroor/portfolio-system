import { prisma } from "../../lib/prisma";
import { verifyPassword } from "../../lib/bcrypt";
import { signAccessToken } from "../../lib/jwt";

import { createSession } from "./session.service";

export async function loginUser(
    email: string,
    password: string
) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    if (!user.isActive) {
        throw new Error("Account disabled.");
    }

    const validPassword = await verifyPassword(
        password,
        user.passwordHash
    );

    if (!validPassword) {
        throw new Error("Invalid email or password.");
    }

    const { session, refreshToken } =
        await createSession(user.id);

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            lastLoginAt: new Date(),
        },
    });

    const accessToken = signAccessToken({
        userId: user.id,
        role: user.role,
    });

    return {
        accessToken,
        refreshToken,
        sessionId: session.id,

        user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
        },
    };
}