import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth.middleware";
import { listWorkspaces } from "../../services/workspace/list-workspaces.service";

const list = new Hono();

list.get("/", authMiddleware, async (c) => {
    try {
        const user = c.get("user");

        const workspaces = await listWorkspaces(user.id);

        return c.json({
            success: true,
            workspaces: workspaces.map((workspace) => ({
                ...workspace,
                membership: workspace.members[0] ?? null,
                members: undefined,
            })),
        });
    } catch (error) {
        console.error("List workspaces error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to retrieve workspaces.",
            },
            500,
        );
    }
});

export default list;