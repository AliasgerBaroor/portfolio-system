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