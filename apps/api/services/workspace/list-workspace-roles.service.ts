
import { prisma } from "../../lib/prisma";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";

export async function listWorkspaceRoles(
    userId: string,
    workspaceId: string,
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        "workspace.roles.read",
    );

    const roles = await prisma.workspaceRole.findMany({
        where: {
            workspaceId,
        },
        select: {
            id: true,
            name: true,
            key: true,
            permissions: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    members: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return roles.map((role) => ({
        id: role.id,
        name: role.name,
        key: role.key,
        permissions: role.permissions,
        memberCount: role._count.members,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
    }));
}
