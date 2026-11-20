
import { Hono } from "hono";
import { Prisma } from "@prisma/client";

import { authMiddleware } from "../../middleware/auth.middleware";
import { CreateWorkspaceSchema } from "../../validators/workspace/create-workspace.validator";
import { createWorkspace } from "../../services/workspace/workspace.service";

const create = new Hono();

create.post("/", authMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        const parsed = CreateWorkspaceSchema.safeParse(body);

        if (!parsed.success) {
            return c.json(
                {
                    success: false,
                    message: "Invalid workspace data.",
                    errors: parsed.error.flatten(),
                },
                400,
            );
        }

        const user = c.get("user");

        const workspace = await createWorkspace(
            user.id,
            parsed.data,
        );

        return c.json(
            {
                success: true,
                workspace,
            },
            201,
        );
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return c.json(
                {
                    success: false,
                    message: "A workspace with this slug already exists. Please try again.",
                },
                409,
            );
        }

        console.error("Create workspace error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to create workspace.",
            },
            500,
        );
    }
});

export default create;
