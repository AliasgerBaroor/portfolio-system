import type { Context } from "hono";

import {
    updateCmsSection,
} from "../../../../services/portfolio/cms/sections.service";

export async function updateCmsSectionHandler(
    c: Context,
) {
    try {
        const user = c.get("user");

        const itemId =
            c.req.param("itemId");

        const sectionId =
            c.req.param("sectionId");

        if (!itemId) {
            return c.json(
                {
                    success: false,
                    message: "Item ID is required.",
                },
                400,
            );
        }

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

        const section =
            await updateCmsSection(
                user.id,
                itemId,
                sectionId,
                {
                    title: body.title,
                    slug: body.slug,
                    type: body.type,
                    sortOrder: body.sortOrder,
                    isVisible: body.isVisible,
                },
            );

        if (!section) {
            return c.json(
                {
                    success: false,
                    message: "CMS section not found.",
                },
                404,
            );
        }

        return c.json({
            success: true,
            section,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update CMS section.",
            },
            404,
        );
    }
}