import type { Context } from "hono";

import {
    getCmsBlocks,
} from "../../../../services/portfolio/cms/blocks.service";

export async function getCmsBlocksHandler(
    c: Context,
) {
    try {
        const user = c.get("user");

        const sectionId =
            c.req.param("sectionId");

        if (!sectionId) {
            return c.json(
                {
                    success: false,
                    message: "Section ID is required.",
                },
                400,
            );
        }

        const result =
            await getCmsBlocks(
                user.id,
                sectionId,
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
                        : "Failed to load CMS blocks.",
            },
            404,
        );
    }
}