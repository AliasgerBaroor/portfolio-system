
import { Hono } from "hono";
import { z } from "zod";

import { authMiddleware } from "../../middleware/auth.middleware";

import {
    WorkspacePermissionError,
} from "../../services/authorization/workspace-permission.service";

import {
    updateWorkspace,
} from "../../services/workspace/update-workspace.service";

const UpdateWorkspaceSchema = z.object({
    name: z.string().trim().min(2).max(80).optional(),
    description: z.string().trim().max(500).nullable().optional(),
}).strict().refine(
    (data) => data.name !== undefined || data.description !== undefined,
    {
        message: "At least one field must be provided.",
    },
);

const update = new Hono();

update.patch("/:workspaceId", authMiddleware, async (c) => {
    try {
        const user = c.get("user");
        const workspaceId = c.req.param("workspaceId");

        if (!workspaceId) {
            return c.json({
                success: false,
                message: "Workspace ID is required.",
            }, 400);
        }

        const body = await c.req.json();
        const parsed = UpdateWorkspaceSchema.safeParse(body);

        if (!parsed.success) {
            return c.json({
                success: false,
                message: "Invalid workspace data.",
                errors: parsed.error.flatten(),
            }, 400);
        }

        const workspace = await updateWorkspace(
            user.id,
            workspaceId,
            parsed.data,
        );

        if (!workspace) {
            return c.json({
                success: false,
                message: "Workspace not found.",
            }, 404);
        }

        return c.json({
            success: true,
            message: "Workspace updated successfully.",
            workspace,
        });
    } catch (error) {
        if (error instanceof WorkspacePermissionError) {
            return c.json({
                success: false,
                message: error.message,
            }, error.statusCode);
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return c.json({
                success: false,
                message: "A workspace with this slug already exists.",
            }, 409);
        }

        console.error("Update workspace error:", error);

        return c.json({
            success: false,
            message: "Failed to update workspace.",
        }, 500);
    }
});

export default update;
