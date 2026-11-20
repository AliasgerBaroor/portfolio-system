import { createHash, randomBytes } from "node:crypto";
import {
    InvitationStatus,
    MembershipStatus,
    WorkspaceStatus,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { WORKSPACE_PERMISSIONS } from "../../constants/workspace-permissions";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";

interface CreateWorkspaceInvitationInput {
    email: string;
    roleId: string;
}

function hashInvitationToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
}

export async function createWorkspaceInvitation(
    userId: string,
    workspaceId: string,
    input: CreateWorkspaceInvitationInput,
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        WORKSPACE_PERMISSIONS.MEMBERS_INVITE,
    );

    const email = input.email.trim().toLowerCase();

    const workspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId,
            status: WorkspaceStatus.ACTIVE,
            deletedAt: null,
        },
        select: { id: true },
    });

    if (!workspace) {
        throw new Error("Workspace not found.");
    }

    const role = await prisma.workspaceRole.findFirst({
        where: {
            id: input.roleId,
            workspaceId,
        },
        select: {
            id: true,
            name: true,
            key: true,
        },
    });

    if (!role) {
        throw new Error("The selected role does not belong to this workspace.");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    if (existingUser) {
        const existingMembership = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: existingUser.id,
                },
            },
            select: { status: true },
        });

        if (existingMembership?.status === MembershipStatus.ACTIVE) {
            throw new Error("This user is already a workspace member.");
        }

        if (existingMembership) {
            throw new Error(
                "This user already has a workspace membership. Resolve that membership before inviting them.",
            );
        }
    }

    const pendingInvitation = await prisma.workspaceInvitation.findFirst({
        where: {
            workspaceId,
            email,
            status: InvitationStatus.PENDING,
        },
        select: {
            id: true,
            expiresAt: true,
        },
    });

    if (pendingInvitation && pendingInvitation.expiresAt > new Date()) {
        throw new Error("A pending invitation already exists for this email.");
    }

    if (pendingInvitation) {
        await prisma.workspaceInvitation.update({
            where: { id: pendingInvitation.id },
            data: { status: InvitationStatus.EXPIRED },
        });
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashInvitationToken(token);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await prisma.workspaceInvitation.create({
        data: {
            workspaceId,
            email,
            roleId: role.id,
            invitedById: userId,
            tokenHash,
            expiresAt,
        },
        select: {
            id: true,
            email: true,
            status: true,
            expiresAt: true,
            createdAt: true,
            role: {
                select: {
                    id: true,
                    name: true,
                    key: true,
                },
            },
        },
    });

    return {
        invitation,
        token,
    };
}