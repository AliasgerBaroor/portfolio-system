
import { InvitationStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";

interface ListWorkspaceInvitationsInput {
    status?: InvitationStatus;
}

export async function listWorkspaceInvitations(
    userId: string,
    workspaceId: string,
    input: ListWorkspaceInvitationsInput = {},
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        "workspace.members.invite",
    );

    const now = new Date();

    // Mark expired pending invitations before returning the list.
    await prisma.workspaceInvitation.updateMany({
        where: {
            workspaceId,
            status: InvitationStatus.PENDING,
            expiresAt: {
                lte: now,
            },
        },
        data: {
            status: InvitationStatus.EXPIRED,
        },
    });

    const invitations = await prisma.workspaceInvitation.findMany({
        where: {
            workspaceId,
            ...(input.status ? { status: input.status } : {}),
        },
        select: {
            id: true,
            email: true,
            status: true,
            expiresAt: true,
            acceptedAt: true,
            revokedAt: true,
            createdAt: true,
            updatedAt: true,
            role: {
                select: {
                    id: true,
                    name: true,
                    key: true,
                },
            },
            invitedBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return invitations;
}
