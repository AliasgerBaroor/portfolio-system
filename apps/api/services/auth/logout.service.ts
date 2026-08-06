import { prisma } from "../../lib/prisma";
import { hashToken } from "../../lib/hash";

export async function logoutUser(
    refreshToken: string
) {
    const refreshTokenHash = hashToken(refreshToken);

    await prisma.session.deleteMany({
        where: {
            refreshTokenHash,
        },
    });
}