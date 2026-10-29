import type { Context } from "hono";

import {
    createCmsItem,
} from "../../../../services/portfolio/cms/items.service";

export async function createCmsItemHandler(
    c: Context,
) {
    try {
        const user = c.get("user");

        const collectionId =
            c.req.param("collectionId");

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

        const body = await c.req.json();

        const item =
            await createCmsItem(
                user.id,
                collectionId,
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

        return c.json(
            {
                success: true,
                item,
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
                        : "Failed to create CMS item.",
            },
            404,
        );
    }
}