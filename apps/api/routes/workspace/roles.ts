
import { Hono, type Handler } from "hono";
import { authMiddleware } from "../../middleware/auth.middleware";
import { WorkspacePermissionError } from "../../services/authorization/workspace-permission.service";
import { listWorkspaceRoles } from "../../services/workspace/list-workspace-roles.service";
import { z } from "zod";
import {
    createWorkspaceRole,
    WorkspaceRoleCreationError,
} from "../../services/workspace/create-workspace-role.service";

import {
    updateWorkspaceRole,
    WorkspaceRoleUpdateError,
} from "../../services/workspace/update-workspace-role.service";

import {
    deleteWorkspaceRole,
    WorkspaceRoleDeletionError,
} from "../../services/workspace/delete-workspace-role.service";

const roles = new Hono();

const CreateWorkspaceRoleSchema = z.object({
    name: z.string().trim().min(2).max(50),
    permissions: z.array(z.string()).min(1),
}).strict();

const UpdateWorkspaceRoleSchema = z.object({
    name: z.string().trim().min(2).max(50).optional(),
    permissions: z.array(z.string()).min(1).optional(),
}).strict().refine(
    (data) => data.name !== undefined || data.permissions !== undefined,
    {
        message: "At least one field must be provided.",
    },
);

roles.get("/:workspaceId/roles", authMiddleware, async (c) => {
    try {
        const user = c.get("user");
        const workspaceId = c.req.param("workspaceId");

        if (!workspaceId) {
            return c.json(
                {
                    success: false,
                    message: "Workspace ID is required.",
                },
                400,
            );
        }

        const result = await listWorkspaceRoles(user.id, workspaceId);

        return c.json({
            success: true,
            message: "Workspace roles retrieved successfully.",
            count: result.length,
            roles: result,
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

        console.error("List workspace roles error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to retrieve workspace roles.",
            },
            500,
        );
    }
});

roles.post("/:workspaceId/roles", authMiddleware, async (c) => {
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
        const parsed = CreateWorkspaceRoleSchema.safeParse(body);

        if (!parsed.success) {
            return c.json(
                {
                    success: false,
                    message: "Invalid role data.",
                    errors: parsed.error.flatten(),
                },
                400,
            );
        }

        const role = await createWorkspaceRole(
            user.id,
            workspaceId,
            parsed.data,
        );

        return c.json(
            {
                success: true,
                message: "Workspace role created successfully.",
                role,
            },
            201,
        );
    } catch (error) {
        if (
            error instanceof WorkspacePermissionError ||
            error instanceof WorkspaceRoleCreationError
        ) {
            return c.json(
                { success: false, message: error.message },
                error.statusCode,
            );
        }

        console.error("Create workspace role error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to create workspace role.",
            },
            500,
        );
    }
});

const updateRoleHandler: Handler = async (c) => {
    try {
        const user = c.get("user");
        const workspaceId = c.req.param("workspaceId");
        const roleId = c.req.param("roleId");

        if (!workspaceId || !roleId) {
            return c.json(
                {
                    success: false,
                    message: "Workspace ID and role ID are required.",
                },
                400,
            );
        }

        const body = await c.req.json();
        const parsed = UpdateWorkspaceRoleSchema.safeParse(body);

        if (!parsed.success) {
            return c.json(
                {
                    success: false,
                    message: "Invalid role update data.",
                    errors: parsed.error.flatten(),
                },
                400,
            );
        }

        const role = await updateWorkspaceRole(
            user.id,
            workspaceId,
            roleId,
            parsed.data,
        );

        return c.json({
            success: true,
            message: "Workspace role updated successfully.",
            role,
        });
    } catch (error) {
        if (
            error instanceof WorkspacePermissionError ||
            error instanceof WorkspaceRoleUpdateError
        ) {
            return c.json(
                {
                    success: false,
                    message: error.message,
                },
                error.statusCode,
            );
        }

        console.error("Update workspace role error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to update workspace role.",
            },
            500,
        );
    }
};

roles.patch("/:workspaceId/roles/:roleId", authMiddleware, updateRoleHandler);

const deleteRoleHandler: Handler = async (c) => {
    try {
        const user = c.get("user");
        const workspaceId = c.req.param("workspaceId");
        const roleId = c.req.param("roleId");

        if (!workspaceId || !roleId) {
            return c.json(
                {
                    success: false,
                    message: "Workspace ID and role ID are required.",
                },
                400,
            );
        }

        const result = await deleteWorkspaceRole(
            user.id,
            workspaceId,
            roleId,
        );

        return c.json({
            success: true,
            message: "Workspace role deleted successfully.",
            role: result,
        });
    } catch (error) {
        if (
            error instanceof WorkspacePermissionError ||
            error instanceof WorkspaceRoleDeletionError
        ) {
            return c.json(
                {
                    success: false,
                    message: error.message,
                },
                error.statusCode,
            );
        }

        console.error("Delete workspace role error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to delete workspace role.",
            },
            500,
        );
    }
};

roles.delete(
    "/:workspaceId/roles/:roleId",
    authMiddleware,
    deleteRoleHandler,
);
export default roles;