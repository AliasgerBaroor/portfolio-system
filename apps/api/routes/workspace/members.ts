import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.middleware";
import { WorkspacePermissionError } from "../../services/authorization/workspace-permission.service";
import { listWorkspaceMembers } from "../../services/workspace/list-workspace-members.service";
import { z } from "zod";

import {
    updateWorkspaceMemberRole,
    WorkspaceMemberRoleError,
} from "../../services/workspace/update-workspace-member-role.service";

import {
    updateWorkspaceMemberStatus,
    WorkspaceMemberStatusError,
} from "../../services/workspace/update-workspace-member-status.service";

import {
    removeWorkspaceMember,
    RemoveWorkspaceMemberError,
} from "../../services/workspace/remove-workspace-member.service";

const members = new Hono();

members.get("/:workspaceId/members", authMiddleware, async (c) => {
    try {
        const user = c.get("user");
        const workspaceId = c.req.param("workspaceId");

        if (!workspaceId) {
            return c.json(
                { success: false, message: "Workspace ID is required." },
                400,
            );
        }

        const result = await listWorkspaceMembers(user.id, workspaceId);

        return c.json({
            success: true,
            members: result,
            total: result.length,
        });
    } catch (error) {
        if (error instanceof WorkspacePermissionError) {
            return c.json(
                { success: false, message: error.message },
                error.statusCode,
            );
        }

        console.error("List workspace members error:", error);

        return c.json(
            { success: false, message: "Failed to fetch workspace members." },
            500,
        );
    }
});


const updateMemberStatusSchema = z.object({
    status: z.enum(["ACTIVE", "SUSPENDED"]),
}).strict();


const updateMemberRoleSchema = z.object({
    roleId: z.string().min(1, "Role ID is required."),
}).strict();

members.patch("/:workspaceId/members/:memberId", authMiddleware, async (c) => {
    try {
        const user = c.get("user");
        const workspaceId = c.req.param("workspaceId");
        const memberId = c.req.param("memberId");

        if (!workspaceId || !memberId) {
            return c.json(
                { success: false, message: "Workspace ID and member ID are required." },
                400,
            );
        }

        const body = await c.req.json();
        const parsed = updateMemberRoleSchema.safeParse(body);

        if (!parsed.success) {
            return c.json(
                {
                    success: false,
                    message: "Invalid request body.",
                    errors: parsed.error.flatten(),
                },
                400,
            );
        }

        const member = await updateWorkspaceMemberRole(
            user.id,
            workspaceId,
            memberId,
            parsed.data.roleId,
        );

        return c.json({
            success: true,
            message: "Workspace member role updated successfully.",
            member,
        });
    } catch (error) {
        if (
            error instanceof WorkspacePermissionError ||
            error instanceof WorkspaceMemberRoleError
        ) {
            return c.json(
                { success: false, message: error.message },
                error.statusCode,
            );
        }

        console.error("Update workspace member role error:", error);

        return c.json(
            { success: false, message: "Failed to update workspace member role." },
            500,
        );
    }
});

members.patch(
    "/:workspaceId/members/:memberId/status",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");
            const workspaceId = c.req.param("workspaceId");
            const memberId = c.req.param("memberId");

            if (!workspaceId || !memberId) {
                return c.json(
                    {
                        success: false,
                        message: "Workspace ID and member ID are required.",
                    },
                    400,
                );
            }

            const body = await c.req.json();
            const parsed = updateMemberStatusSchema.safeParse(body);

            if (!parsed.success) {
                return c.json(
                    {
                        success: false,
                        message: "Invalid request body.",
                        errors: parsed.error.flatten(),
                    },
                    400,
                );
            }

            const member = await updateWorkspaceMemberStatus(
                user.id,
                workspaceId,
                memberId,
                parsed.data.status,
            );

            return c.json({
                success: true,
                message: `Workspace member ${parsed.data.status.toLowerCase()} successfully.`,
                member,
            });
        } catch (error) {
            if (
                error instanceof WorkspacePermissionError ||
                error instanceof WorkspaceMemberStatusError
            ) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    error.statusCode,
                );
            }

            console.error("Update workspace member status error:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to update workspace member status.",
                },
                500,
            );
        }
    },
);

members.delete(
    "/:workspaceId/members/:memberId",
    authMiddleware,
    async (c) => {
    try {
        const user = c.get("user");
        const { workspaceId, memberId } = c.req.param();

        if (!workspaceId || !memberId) {
            return c.json(
                {
                    success: false,
                    message: "Workspace ID and member ID are required.",
                },
                400,
            );
        }

        const result = await removeWorkspaceMember(
            user.id,
            workspaceId,
            memberId,
        );

        return c.json({
            success: true,
            message: "Workspace member removed successfully.",
            member: result,
        });
    } catch (error) {
        if (error instanceof WorkspacePermissionError) {
            return c.json(
                { success: false, message: error.message },
                error.statusCode,
            );
        }

        if (error instanceof RemoveWorkspaceMemberError) {
            return c.json(
                { success: false, message: error.message },
                error.statusCode,
            );
        }

        console.error("Remove workspace member error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to remove workspace member.",
            },
            500,
        );
    }
});

export default members;