import { Hono } from "hono";
import { authMiddleware } from "../../../../middleware/auth";
import { deletePortfolioContentBlock } from "../../../../services/portfolio/content-blocks.service";

const remove = new Hono();

remove.delete(
    "/:sectionId/blocks/:blockId",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");

            const sectionId = c.req.param("sectionId");
            const blockId = c.req.param("blockId");

            if (!sectionId) {
                return c.json(
                    {
                        success: false,
                        message: "Section ID is required.",
                    },
                    400
                );
            }

            if (!blockId) {
                return c.json(
                    {
                        success: false,
                        message: "Block ID is required.",
                    },
                    400
                );
            }

            const result = await deletePortfolioContentBlock(
                user.id,
                sectionId,
                blockId
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
                            : "Failed to delete content block.",
                },
                400
            );
        }
    }
);

export default remove;