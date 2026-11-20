
import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth.middleware";
import {
    WorkspacePermissionError,
} from "../../services/authorization/workspace-permission.service";

import { getWorkspace } from "../../services/workspace/get-workspace.service";

const details = new Hono();

details.get("/:workspaceId", authMiddleware, async (c) => {
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

        const workspace = await getWorkspace(
            user.id,
            workspaceId,
        );

        if (!workspace) {
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
            workspace,
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

        console.error("Get workspace error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to retrieve workspace.",
            },
            500,
        );
    }
});

export default details;