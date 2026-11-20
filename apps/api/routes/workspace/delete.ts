
import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth.middleware";

import {
    WorkspacePermissionError,
} from "../../services/authorization/workspace-permission.service";

import {
    deleteWorkspace,
} from "../../services/workspace/delete-workspace.service";

const remove = new Hono();

remove.delete("/:workspaceId", authMiddleware, async (c) => {
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

        const result = await deleteWorkspace(
            user.id,
            workspaceId,
        );

        if (!result) {
            return c.json(
                {
                    success: false,
                    message: "Workspace not found.",
                },
                404,
            );
        }

        return c.json({
            success: true,
            message: "Workspace archived successfully.",
            workspace: result,
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

        console.error("Delete workspace error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to archive workspace.",
            },
            500,
        );
    }
});

export default remove;
