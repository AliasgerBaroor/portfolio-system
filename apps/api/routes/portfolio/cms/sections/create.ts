
import type { Context } from "hono";

import {
    createCmsSection,
} from "../../../../services/portfolio/cms/sections.service";

export async function createCmsSectionHandler(
    c: Context,
) {
    try {
        const user = c.get("user");

        const itemId =
            c.req.param("itemId");

        if (!itemId) {
            return c.json(
                {
                    success: false,
                    message: "Item ID is required.",
                },
                400,
            );
        }

        const body = await c.req.json();

        const section =
            await createCmsSection(
                user.id,
                itemId,
                {
                    title: body.title,
                    slug: body.slug,
                    type: body.type,
                    sortOrder: body.sortOrder,
                    isVisible: body.isVisible,
                },
            );

        return c.json(
            {
                success: true,
                section,
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
                        : "Failed to create CMS section.",
            },
            404,
        );
    }
}