import type { Context } from "hono";

import {
    updateCmsBlock,
} from "../../../../services/portfolio/cms/blocks.service";

export async function updateCmsBlockHandler(
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

        const body = await c.req.json();

        const block =
            await updateCmsBlock(
                user.id,
                sectionId,
                blockId,
                {
                    type: body.type,
                    title: body.title,
                    content: body.content,
                    sortOrder: body.sortOrder,
                    isVisible: body.isVisible,
                },
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
                        : "Failed to update CMS block.",
            },
            404,
        );
    }
}