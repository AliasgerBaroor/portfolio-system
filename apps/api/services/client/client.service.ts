import { prisma } from "../../lib/prisma";

export async function getClients(
    userId: string
) {
    return prisma.client.findMany({
        where: {
            ownerId: userId,
            deletedAt: null,
            isActive: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function createClient(
    userId: string,
    data: {
        name: string;
        company?: string;
        email?: string;
    }
) {
    return prisma.client.create({
        data: {
            ownerId: userId,
            name: data.name,
            company: data.company,
            email: data.email,
        },
    });
}

export async function removeClient(
    userId: string,
    clientId: string
) {
    const client =
        await prisma.client.findFirst({
            where: {
                id: clientId,
                ownerId: userId,
                deletedAt: null,
            },
        });

    if (!client) {
        throw new Error(
            "Client not found."
        );
    }

    return prisma.client.update({
        where: {
            id: client.id,
        },
        data: {
            isActive: false,
            deletedAt: new Date(),
        },
    });
}