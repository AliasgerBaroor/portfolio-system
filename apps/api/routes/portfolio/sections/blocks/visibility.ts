import { Hono } from "hono";
import { authMiddleware } from "../../../../middleware/auth";
import { updatePortfolioContentBlockVisibility } from "../../../../services/portfolio/content-blocks.service";

const visibility = new Hono();

visibility.patch(
    "/:sectionId/blocks/:blockId/visibility",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");

            const sectionId = c.req.param("sectionId");
            const blockId = c.req.param("blockId");

            if (!sectionId || !blockId) {
                return c.json(
                    {
                        success: false,
                        message: "Section ID and block ID are required.",
                    },
                    400
                );
            }

            const body = await c.req.json();

            const result =
                await updatePortfolioContentBlockVisibility(
                    user.id,
                    sectionId,
                    blockId,
                    body.isVisible
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
                            : "Failed to update block visibility.",
                },
                400
            );
        }
    }
);

export default visibility;