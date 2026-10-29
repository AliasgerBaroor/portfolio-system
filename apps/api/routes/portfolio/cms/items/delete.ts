import type { Context } from "hono";

import {
    deleteCmsItem,
} from "../../../../services/portfolio/cms/items.service";

export async function deleteCmsItemHandler(
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

        const item =
            await deleteCmsItem(
                user.id,
                collectionId,
                itemId,
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
                        : "Failed to delete CMS item.",
            },
            404,
        );
    }
}