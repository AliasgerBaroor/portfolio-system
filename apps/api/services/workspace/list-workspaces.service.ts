import {
    MembershipStatus,
    WorkspaceStatus,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";

export async function listWorkspaces(userId: string) {
    return prisma.workspace.findMany({
        where: {
            status: WorkspaceStatus.ACTIVE,
            deletedAt: null,
            members: {
                some: {
                    userId,
                    status: MembershipStatus.ACTIVE,
                },
            },
        },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            status: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
            members: {
                where: {
                    userId,
                    status: MembershipStatus.ACTIVE,
                },
                select: {
                    role: {
                        select: {
                            id: true,
                            name: true,
                            key: true,
                            permissions: true,
                        },
                    },
                },
                take: 1,
            },
            _count: {
                select: {
                    members: true,
                    applications: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}