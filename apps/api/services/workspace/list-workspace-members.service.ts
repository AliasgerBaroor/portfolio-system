import { MembershipStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { WORKSPACE_PERMISSIONS } from "../../constants/workspace-permissions";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";

export async function listWorkspaceMembers(
    userId: string,
    workspaceId: string,
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        WORKSPACE_PERMISSIONS.MEMBERS_READ,
    );

    const members = await prisma.workspaceMember.findMany({
        where: {
            workspaceId,
            status: MembershipStatus.ACTIVE,
        },
        select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    email: true,
                    username: true,
                    fullName: true,
                    displayName: true,
                    avatar: true,
                },
            },
            role: {
                select: {
                    id: true,
                    name: true,
                    key: true,
                    permissions: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return members;
}