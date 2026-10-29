import { Hono } from "hono";
import { authMiddleware } from "../../../../middleware/auth";
import { getPortfolioContentBlocks } from "../../../../services/portfolio/content-blocks.service";

const get = new Hono();

get.get("/:sectionId/blocks", authMiddleware, async (c) => {
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

        const result = await getPortfolioContentBlocks(
            user.id,
            sectionId
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
                        : "Failed to load content blocks.",
            },
            404
        );
    }
});

export default get;