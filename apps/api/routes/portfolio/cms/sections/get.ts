import type { Context } from "hono";

import {
    getCmsSection,
    getCmsSections,
} from "../../../../services/portfolio/cms/sections.service";

export async function getCmsSectionsHandler(
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

        const result =
            await getCmsSections(
                user.id,
                itemId,
            );

        return c.json({
            success: true,
            sections: result,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to load CMS sections.",
            },
            404,
        );
    }
}

export async function getCmsSectionHandler(
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

        const result =
            await getCmsSection(
                user.id,
                itemId,
                sectionId,
            );

        if (!result) {
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
            section: result,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to load CMS section.",
            },
            404,
        );
    }
}