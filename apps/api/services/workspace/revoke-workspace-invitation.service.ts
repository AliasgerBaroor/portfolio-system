
import { InvitationStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";

export class InvitationRevocationError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404 | 409,
    ) {
        super(message);
        this.name = "InvitationRevocationError";
    }
}

export async function revokeWorkspaceInvitation(
    userId: string,
    workspaceId: string,
    invitationId: string,
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        "workspace.members.invite",
    );

    const invitation = await prisma.workspaceInvitation.findFirst({
        where: {
            id: invitationId,
            workspaceId,
        },
        select: {
            id: true,
            status: true,
            expiresAt: true,
        },
    });

    if (!invitation) {
        throw new InvitationRevocationError(
            "Workspace invitation not found.",
            404,
        );
    }

    if (invitation.status !== InvitationStatus.PENDING) {
        throw new InvitationRevocationError(
            "Only pending invitations can be revoked.",
            409,
        );
    }

    const now = new Date();

    if (invitation.expiresAt <= now) {
        await prisma.workspaceInvitation.updateMany({
            where: {
                id: invitationId,
                workspaceId,
                status: InvitationStatus.PENDING,
            },
            data: {
                status: InvitationStatus.EXPIRED,
            },
        });

        throw new InvitationRevocationError(
            "This invitation has expired and cannot be revoked.",
            409,
        );
    }

    const result = await prisma.workspaceInvitation.updateMany({
        where: {
            id: invitationId,
            workspaceId,
            status: InvitationStatus.PENDING,
            expiresAt: {
                gt: now,
            },
        },
        data: {
            status: InvitationStatus.REVOKED,
            revokedAt: now,
        },
    });

    if (result.count === 0) {
        throw new InvitationRevocationError(
            "This invitation is no longer pending or has expired.",
            409,
        );
    }

    return {
        invitationId,
        status: InvitationStatus.REVOKED,
        revokedAt: now,
    };
}
