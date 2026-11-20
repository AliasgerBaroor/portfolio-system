import { createHash } from "node:crypto";
import {
    InvitationStatus,
    MembershipStatus,
    WorkspaceStatus,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";

export class InvitationAcceptanceError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 403 | 404 | 409,
    ) {
        super(message);
        this.name = "InvitationAcceptanceError";
    }
}

function hashInvitationToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
}

export async function acceptWorkspaceInvitation(
    userId: string,
    userEmail: string,
    token: string,
) {
    const normalizedEmail = userEmail.trim().toLowerCase();
    const tokenHash = hashInvitationToken(token);
    const now = new Date();

    // Read first so we can return a useful error for expired invitations.
    const invitation = await prisma.workspaceInvitation.findUnique({
        where: { tokenHash },
        select: {
            id: true,
            workspaceId: true,
            email: true,
            roleId: true,
            status: true,
            expiresAt: true,
            workspace: {
                select: {
                    status: true,
                    deletedAt: true,
                },
            },
        },
    });

    if (!invitation) {
        throw new InvitationAcceptanceError(
            "Invitation not found.",
            404,
        );
    }

    if (invitation.status !== InvitationStatus.PENDING) {
        throw new InvitationAcceptanceError(
            "This invitation is no longer pending.",
            409,
        );
    }

    if (invitation.expiresAt <= now) {
        await prisma.workspaceInvitation.updateMany({
            where: {
                id: invitation.id,
                status: InvitationStatus.PENDING,
            },
            data: {
                status: InvitationStatus.EXPIRED,
            },
        });

        throw new InvitationAcceptanceError(
            "This invitation has expired.",
            400,
        );
    }

    if (
        invitation.workspace.status !== WorkspaceStatus.ACTIVE ||
        invitation.workspace.deletedAt !== null
    ) {
        throw new InvitationAcceptanceError(
            "This workspace is no longer active.",
            409,
        );
    }

    if (invitation.email.trim().toLowerCase() !== normalizedEmail) {
        throw new InvitationAcceptanceError(
            "This invitation belongs to a different email address.",
            403,
        );
    }

    return prisma.$transaction(async (tx) => {
        // Prevent duplicate membership creation.
        const existingMembership = await tx.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: invitation.workspaceId,
                    userId,
                },
            },
            select: {
                id: true,
                status: true,
            },
        });

        if (existingMembership) {
            throw new InvitationAcceptanceError(
                "You already have a membership in this workspace.",
                409,
            );
        }

        // Claim the invitation atomically. Only one request can accept it.
        const claimedInvitation = await tx.workspaceInvitation.updateMany({
            where: {
                id: invitation.id,
                tokenHash,
                status: InvitationStatus.PENDING,
                expiresAt: { gt: now },
            },
            data: {
                status: InvitationStatus.ACCEPTED,
                acceptedAt: now,
            },
        });

        if (claimedInvitation.count !== 1) {
            throw new InvitationAcceptanceError(
                "This invitation has already been used or has expired.",
                409,
            );
        }

        const membership = await tx.workspaceMember.create({
            data: {
                workspaceId: invitation.workspaceId,
                userId,
                roleId: invitation.roleId,
                status: MembershipStatus.ACTIVE,
                joinedAt: now,
            },
            select: {
                id: true,
                workspaceId: true,
                userId: true,
                status: true,
                joinedAt: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        key: true,
                    },
                },
            },
        });

        return membership;
    });
}