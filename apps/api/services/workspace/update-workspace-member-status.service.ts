
import {
    MembershipStatus,
    WorkspaceStatus,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { WORKSPACE_PERMISSIONS } from "../../constants/workspace-permissions";

import {
    requireWorkspacePermission,
} from "../authorization/workspace-permission.service";

export class WorkspaceMemberStatusError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404 | 409,
    ) {
        super(message);
        this.name = "WorkspaceMemberStatusError";
    }
}

type MemberStatusInput = "ACTIVE" | "SUSPENDED";

export async function updateWorkspaceMemberStatus(
    userId: string,
    workspaceId: string,
    memberId: string,
    newStatus: MemberStatusInput,
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
            throw new WorkspaceMemberStatusError(
                "Workspace not found.",
                404,
            );
        }

        const member = await tx.workspaceMember.findFirst({
            where: {
                id: memberId,
                workspaceId,
            },
            select: {
                id: true,
                userId: true,
                status: true,
            },
        });

        if (!member) {
            throw new WorkspaceMemberStatusError(
                "Workspace member not found.",
                404,
            );
        }

        if (member.userId === workspace.ownerId) {
            throw new WorkspaceMemberStatusError(
                "The workspace owner cannot be suspended.",
                409,
            );
        }

        if (member.userId === userId) {
            throw new WorkspaceMemberStatusError(
                "You cannot change your own membership status.",
                409,
            );
        }

        if (
            member.status !== MembershipStatus.ACTIVE &&
            member.status !== MembershipStatus.SUSPENDED
        ) {
            throw new WorkspaceMemberStatusError(
                "Only active or suspended members can be updated.",
                409,
            );
        }

        if (member.status === newStatus) {
            throw new WorkspaceMemberStatusError(
                `Member is already ${newStatus.toLowerCase()}.`,
                409,
            );
        }

        const result = await tx.workspaceMember.updateMany({
            where: {
                id: member.id,
                workspaceId,
                status: member.status,
            },
            data: {
                status: newStatus,
            },
        });

        if (result.count !== 1) {
            throw new WorkspaceMemberStatusError(
                "Membership changed before this operation could complete. Please retry.",
                409,
            );
        }

        return tx.workspaceMember.findUniqueOrThrow({
            where: {
                id: member.id,
            },
            select: {
                id: true,
                workspaceId: true,
                userId: true,
                status: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        displayName: true,
                    },
                },
                role: {
                    select: {
                        id: true,
                        name: true,
                        key: true,
                    },
                },
            },
        });
    });
}
