
import { MembershipStatus, WorkspaceStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { WORKSPACE_PERMISSIONS } from "../../constants/workspace-permissions";
import {
    requireWorkspacePermission,
} from "../authorization/workspace-permission.service";

export class WorkspaceMemberRoleError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404 | 409,
    ) {
        super(message);
        this.name = "WorkspaceMemberRoleError";
    }
}

export async function updateWorkspaceMemberRole(
    userId: string,
    workspaceId: string,
    memberId: string,
    roleId: string,
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        WORKSPACE_PERMISSIONS.MEMBERS_UPDATE,
    );

    return prisma.$transaction(async (tx) => {
        const workspace = await tx.workspace.findFirst({
            where: {
                id: workspaceId,
                status: WorkspaceStatus.ACTIVE,
                deletedAt: null,
            },
            select: {
                id: true,
                ownerId: true,
            },
        });

        if (!workspace) {
            throw new WorkspaceMemberRoleError(
                "Workspace not found.",
                404,
            );
        }

        const member = await tx.workspaceMember.findFirst({
            where: {
                id: memberId,
                workspaceId,
                status: MembershipStatus.ACTIVE,
            },
            select: {
                id: true,
                userId: true,
                roleId: true,
            },
        });

        if (!member) {
            throw new WorkspaceMemberRoleError(
                "Active workspace member not found.",
                404,
            );
        }

        if (member.userId === workspace.ownerId) {
            throw new WorkspaceMemberRoleError(
                "The workspace owner's role cannot be changed.",
                409,
            );
        }

        if (member.userId === userId) {
            throw new WorkspaceMemberRoleError(
                "You cannot change your own role.",
                409,
            );
        }

        const role = await tx.workspaceRole.findFirst({
            where: {
                id: roleId,
                workspaceId,
            },
            select: {
                id: true,
                name: true,
                key: true,
                permissions: true,
            },
        });

        if (!role) {
            throw new WorkspaceMemberRoleError(
                "Role not found in this workspace.",
                404,
            );
        }

        if (member.roleId === role.id) {
            throw new WorkspaceMemberRoleError(
                "Member already has this role.",
                409,
            );
        }

        const updatedMember = await tx.workspaceMember.update({
            where: {
                id: member.id,
            },
            data: {
                roleId: role.id,
            },
            select: {
                id: true,
                workspaceId: true,
                userId: true,
                status: true,
                updatedAt: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        key: true,
                        permissions: true,
                    },
                },
            },
        });

        return updatedMember;
    });
}
