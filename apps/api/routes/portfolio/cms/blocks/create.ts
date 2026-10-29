import type { Context } from "hono";

import {
    createCmsBlock,
} from "../../../../services/portfolio/cms/blocks.service";

export async function createCmsBlockHandler(
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

        const body = await c.req.json();

        const block =
            await createCmsBlock(
                user.id,
                sectionId,
                {
                    type: body.type,
                    title: body.title,
                    content: body.content,
                    sortOrder: body.sortOrder,
                },
            );

        return c.json(
            {
                success: true,
                block,
            },
            201,
        );
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to create CMS block.",
            },
            404,
        );
    }
}