import { Hono } from "hono";
import { z } from "zod";

import { authMiddleware } from "../../middleware/auth.middleware";
import { WorkspacePermissionError } from "../../services/authorization/workspace-permission.service";
import { createWorkspaceInvitation } from "../../services/workspace/create-workspace-invitation.service";

import {
    revokeWorkspaceInvitation,
    InvitationRevocationError,
} from "../../services/workspace/revoke-workspace-invitation.service";

import { InvitationStatus } from "@prisma/client";

import { listWorkspaceInvitations } from "../../services/workspace/list-workspace-invitations.service";

const invitations = new Hono();

const CreateInvitationSchema = z.object({
    email: z.string().trim().email().max(254),
    roleId: z.string().min(1),
}).strict();

invitations.post(
    "/:workspaceId/invitations",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");
            const workspaceId = c.req.param("workspaceId");

            if (!workspaceId) {
                return c.json(
                    { success: false, message: "Workspace ID is required." },
                    400,
                );
            }

            const body = await c.req.json();
            const parsed = CreateInvitationSchema.safeParse(body);

            if (!parsed.success) {
                return c.json(
                    {
                        success: false,
                        message: "Invalid invitation data.",
                        errors: parsed.error.flatten(),
                    },
                    400,
                );
            }

            const result = await createWorkspaceInvitation(
                user.id,
                workspaceId,
                parsed.data,
            );

            return c.json(
                {
                    success: true,
                    message: "Workspace invitation created successfully.",
                    invitation: result.invitation,
                    token: result.token,
                },
                201,
            );
        } catch (error) {
            if (error instanceof WorkspacePermissionError) {
                return c.json(
                    { success: false, message: error.message },
                    error.statusCode,
                );
            }

            if (error instanceof Error) {
                const knownErrors = [
                    "Workspace not found.",
                    "The selected role does not belong to this workspace.",
                    "This user is already a workspace member.",
                    "This user already has a workspace membership. Resolve that membership before inviting them.",
                    "A pending invitation already exists for this email.",
                ];

                if (knownErrors.includes(error.message)) {
                    return c.json(
                        { success: false, message: error.message },
                        409,
                    );
                }
            }

            console.error("Create workspace invitation error:", error);

            return c.json(
                { success: false, message: "Failed to create workspace invitation." },
                500,
            );
        }
    },
);


invitations.delete(
    "/:workspaceId/invitations/:invitationId",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");
            const workspaceId = c.req.param("workspaceId");
            const invitationId = c.req.param("invitationId");

            if (!workspaceId || !invitationId) {
                return c.json(
                    {
                        success: false,
                        message: "Workspace ID and invitation ID are required.",
                    },
                    400,
                );
            }

            const result = await revokeWorkspaceInvitation(
                user.id,
                workspaceId,
                invitationId,
            );

            return c.json({
                success: true,
                message: "Workspace invitation revoked successfully.",
                invitation: result,
            });
        } catch (error) {
            if (
                error instanceof WorkspacePermissionError ||
                error instanceof InvitationRevocationError
            ) {
                return c.json(
                    { success: false, message: error.message },
                    error.statusCode,
                );
            }

            console.error("Revoke workspace invitation error:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to revoke workspace invitation.",
                },
                500,
            );
        }
    },
);


invitations.get(
    "/:workspaceId/invitations",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");
            const workspaceId = c.req.param("workspaceId");
            const statusParam = c.req.query("status");

            if (!workspaceId) {
                return c.json(
                    {
                        success: false,
                        message: "Workspace ID is required.",
                    },
                    400,
                );
            }

            const validStatuses = Object.values(InvitationStatus);

            if (
                statusParam &&
                !validStatuses.includes(statusParam as InvitationStatus)
            ) {
                return c.json(
                    {
                        success: false,
                        message: "Invalid invitation status.",
                        allowedStatuses: validStatuses,
                    },
                    400,
                );
            }

            const invitations = await listWorkspaceInvitations(
                user.id,
                workspaceId,
                statusParam
                    ? { status: statusParam as InvitationStatus }
                    : {},
            );

            return c.json({
                success: true,
                message: "Workspace invitations retrieved successfully.",
                count: invitations.length,
                invitations,
            });
        } catch (error) {
            if (error instanceof WorkspacePermissionError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    error.statusCode,
                );
            }

            console.error("List workspace invitations error:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to retrieve workspace invitations.",
                },
                500,
            );
        }
    },
);

export default invitations;