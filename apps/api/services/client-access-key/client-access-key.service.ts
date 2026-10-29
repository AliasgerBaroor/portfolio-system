import bcrypt from "bcrypt";

import { prisma } from "../../lib/prisma";

import { generateClientPassword } from "../../utils/generate-client-password";

import type { CreateClientAccessKeyDto } from "../../dto/client-access/create-client-access-key.dto";

import {
    encryptClientPassword,
    decryptClientPassword,
} from "../../utils/encrypt-client-password";
import { generateClientCredentialId } from "../../lib/generate-client-credential-id";

export async function createClientAccessKey(
    userId: string,
    data: CreateClientAccessKeyDto
) {

    const frontendUrl =
        process.env.FRONTEND_URL;

    if (!frontendUrl) {
        throw new Error(
            "FRONTEND_URL is not configured."
        );
    }

    const portfolio =
        await prisma.portfolio.findFirst({
            where: {
                id: data.portfolioId,
                ownerId: userId,
                deletedAt: null,
            },
        });

    if (!portfolio) {
        throw new Error("Portfolio not found.");
    }

    const client =
        await prisma.client.findFirst({
            where: {
                id: data.clientId,
                ownerId: userId,
                deletedAt: null,
                isActive: true,
            },
        });

    if (!client) {
        throw new Error("Client not found.");
    }

    const password = generateClientPassword();

    const passwordHash =
        await bcrypt.hash(password, 12);

    const encryptedPassword =
        encryptClientPassword(password);

    const credentialId =
        generateClientCredentialId();

    const expiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
    );

    const accessKey =
        await prisma.$transaction(async (tx) => {
            const key =
                await tx.clientAccessKey.create({
                    data: {
                        ownerId: userId,
                        clientId: client.id,
                        name: client.name,
                        credentialId,
                        passwordHash,
                        encryptedPassword,
                        expiresAt,
                        deviceLimit: 1,
                    },
                });

            await tx.portfolioClientAccess.create({
                data: {
                    accessKeyId: key.id,
                    portfolioId: portfolio.id,
                },
            });

            return key;
        });

    return {
        accessKey,
        password,
        credentialId,
        accessUrl:
            `${frontendUrl.replace(/\/$/, "")}` +
            `/${portfolio.slug}/access/${credentialId}`,
    };
}

export async function getClientAccessKeys(
    userId: string,
    portfolioId: string
) {
    const portfolio =
        await prisma.portfolio.findFirst({
            where: {
                id: portfolioId,
                ownerId: userId,
                deletedAt: null,
            },
        });

    if (!portfolio) {
        throw new Error("Portfolio not found.");
    }

    const portfolioAccess =
        await prisma.portfolioClientAccess.findMany({
            where: {
                portfolioId: portfolio.id,
                accessKey: {
                    deletedAt: null,
                },
            },
            include: {
                accessKey: true,
            },
            orderBy: {
                accessKey: {
                    createdAt: "desc",
                },
            },
        });

    return portfolioAccess.map(
        ({ accessKey }) => {
            const expired =
                accessKey.expiresAt !== null &&
                accessKey.expiresAt <= new Date();

            if (
                expired &&
                accessKey.isActive
            ) {
                return {
                    ...accessKey,
                    isActive: false,
                    password: null,
                };
            }

            if (!accessKey.isActive) {
                return {
                    ...accessKey,
                    password: null,
                };
            }

            return {
                ...accessKey,
                password:
                    decryptClientPassword(
                        accessKey.encryptedPassword
                    ),
            };
        }
    );
}

export async function revokeClientAccessKey(
    userId: string,
    accessKeyId: string
) {
    const accessKey =
        await prisma.clientAccessKey.findFirst({
            where: {
                id: accessKeyId,
                ownerId: userId,
                deletedAt: null,
            },
        });

    if (!accessKey) {
        throw new Error(
            "Client access key not found."
        );
    }

    await prisma.$transaction(
        async (tx) => {
            // Revoke the key
            await tx.clientAccessKey.update({
                where: {
                    id: accessKey.id,
                },
                data: {
                    isActive: false,
                },
            });

            // Immediately invalidate all
            // active client sessions.
            await tx.clientAccessSession.deleteMany({
                where: {
                    accessKeyId: accessKey.id,
                },
            });
        }
    );

    return {
        id: accessKey.id,
    };
}