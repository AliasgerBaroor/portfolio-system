import type { Context } from "hono";

import {
    deleteCmsBlock,
} from "../../../../services/portfolio/cms/blocks.service";

export async function deleteCmsBlockHandler(
    c: Context,
) {
    try {
        const user = c.get("user");

        const sectionId =
            c.req.param("sectionId");

        const blockId =
            c.req.param("blockId");

        if (!sectionId) {
            return c.json(
                {
                    success: false,
                    message: "Section ID is required.",
                },
                400,
            );
        }

        if (!blockId) {
            return c.json(
                {
                    success: false,
                    message: "Block ID is required.",
                },
                400,
            );
        }

        const block =
            await deleteCmsBlock(
                user.id,
                sectionId,
                blockId,
            );

        if (!block) {
            return c.json(
                {
                    success: false,
                    message: "Block not found.",
                },
                404,
            );
        }

        return c.json({
            success: true,
            block,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete CMS block.",
            },
            404,
        );
    }
}