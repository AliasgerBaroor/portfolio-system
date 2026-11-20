import { MembershipStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import {
    requireWorkspacePermission,
} from "../authorization/workspace-permission.service";

export class RemoveWorkspaceMemberError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404 | 409,
    ) {
        super(message);
        this.name = "RemoveWorkspaceMemberError";
    }
}

export async function removeWorkspaceMember(
    userId: string,
    workspaceId: string,
    memberId: string,
) {
    const workspace = await requireWorkspacePermission(
        userId,
        workspaceId,
        "workspace.members.remove",
    );

    if (workspace.ownerId === userId) {
        // The owner may remove other members, but cannot remove themselves.
        // The next check handles attempts to target the owner membership.
    }

    const member = await prisma.workspaceMember.findFirst({
        where: {
            id: memberId,
            workspaceId,
            status: {
                in: [MembershipStatus.ACTIVE, MembershipStatus.SUSPENDED],
            },
        },
        select: {
            id: true,
            userId: true,
            status: true,
        },
    });

    if (!member) {
        throw new RemoveWorkspaceMemberError(
            "Workspace member not found.",
            404,
        );
    }

    if (member.userId === workspace.ownerId) {
        throw new RemoveWorkspaceMemberError(
            "The workspace owner cannot be removed.",
            409,
        );
    }

    if (member.userId === userId) {
        throw new RemoveWorkspaceMemberError(
            "You cannot remove yourself from the workspace.",
            409,
        );
    }

    const result = await prisma.workspaceMember.deleteMany({
        where: {
            id: member.id,
            workspaceId,
            userId: member.userId,
            status: member.status,
        },
    });

    if (result.count === 0) {
        throw new RemoveWorkspaceMemberError(
            "The membership could not be removed. It may have changed; refresh and try again.",
            409,
        );
    }

    return {
        memberId: member.id,
        userId: member.userId,
        status: "REMOVED" as const,
    };
}