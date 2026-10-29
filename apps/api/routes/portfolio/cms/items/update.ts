import type { Context } from "hono";

import {
    updateCmsItem,
} from "../../../../services/portfolio/cms/items.service";

export async function updateCmsItemHandler(
    c: Context,
) {
    try {
        const user = c.get("user");

        const collectionId =
            c.req.param("collectionId");

        const itemId =
            c.req.param("itemId");

        if (!collectionId) {
            return c.json(
                {
                    success: false,
                    message:
                        "Collection ID is required.",
                },
                400,
            );
        }

        if (!itemId) {
            return c.json(
                {
                    success: false,
                    message:
                        "Item ID is required.",
                },
                400,
            );
        }

        const body = await c.req.json();

        const item =
            await updateCmsItem(
                user.id,
                collectionId,
                itemId,
                {
                    title: body.title,
                    slug: body.slug,
                    description:
                        body.description,
                    data: body.data,
                    isPublished:
                        body.isPublished,
                    isVisible:
                        body.isVisible,
                    sortOrder:
                        body.sortOrder,
                },
            );

        if (!item) {
            return c.json(
                {
                    success: false,
                    message: "CMS item not found.",
                },
                404,
            );
        }

        return c.json({
            success: true,
            item,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update CMS item.",
            },
            404,
        );
    }
}