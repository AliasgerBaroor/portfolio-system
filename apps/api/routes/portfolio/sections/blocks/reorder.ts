import { Hono } from "hono";
import { authMiddleware } from "../../../../middleware/auth";
import { reorderPortfolioContentBlocks } from "../../../../services/portfolio/content-blocks.service";

const reorder = new Hono();

reorder.patch(
    "/:sectionId/blocks/reorder",
    authMiddleware,
    async (c) => {
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

            if (!Array.isArray(body.blockIds)) {
                return c.json(
                    {
                        success: false,
                        message: "blockIds must be an array.",
                    },
                    400
                );
            }

            const result =
                await reorderPortfolioContentBlocks(
                    user.id,
                    sectionId,
                    body.blockIds
                );

            return c.json({
                success: true,
                blocks: result,
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to reorder content blocks.",
                },
                400
            );
        }
    }
);

export default reorder;