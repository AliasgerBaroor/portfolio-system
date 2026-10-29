import type { Context } from "hono";

import {
    deleteCmsSection,
} from "../../../../services/portfolio/cms/sections.service";

export async function deleteCmsSectionHandler(
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

        const section =
            await deleteCmsSection(
                user.id,
                itemId,
                sectionId,
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
                        : "Failed to delete CMS section.",
            },
            404,
        );
    }
}