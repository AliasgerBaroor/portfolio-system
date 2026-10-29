import { Hono } from "hono";
import { authMiddleware } from "../../../../middleware/auth";
import { createPortfolioContentBlock } from "../../../../services/portfolio/content-blocks.service";

const create = new Hono();

create.post("/:sectionId/blocks", authMiddleware, async (c) => {
    try {
        const user = c.get("user");
        const sectionId = c.req.param("sectionId");

        if (!sectionId) {
            return c.json(
                {
                    success: false,
                    message: "Section ID is required.",
                },
                400
            );
        }

        const body = await c.req.json();

        const result = await createPortfolioContentBlock(
            user.id,
            sectionId,
            body
        );

        return c.json({
            success: true,
            block: result,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to create content block.",
            },
            400
        );
    }
});

export default create;