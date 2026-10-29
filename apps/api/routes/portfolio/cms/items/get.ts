import type { Context } from "hono";

import {
    getCmsItem,
    getCmsItems,
} from "../../../../services/portfolio/cms/items.service";

export async function getCmsItemsHandler(
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

        const result =
            await getCmsItems(
                user.id,
                collectionId,
            );

        return c.json({
            success: true,
            items: result,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to load CMS items.",
            },
            404,
        );
    }
}

export async function getCmsItemHandler(
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

        const result =
            await getCmsItem(
                user.id,
                collectionId,
                itemId,
            );

        if (!result) {
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
            item: result,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to load CMS item.",
            },
            404,
        );
    }
}