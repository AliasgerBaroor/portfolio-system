import type { Context } from "hono";

import {
    deleteCmsCollection,
} from "../../../../services/portfolio/cms/collections.service";

export async function deleteCmsCollectionHandler(
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
                    message: "Collection ID is required.",
                },
                400,
            );
        }

        const collection =
            await deleteCmsCollection(
                user.id,
                collectionId,
            );

        if (!collection) {
            return c.json(
                {
                    success: false,
                    message: "Collection not found.",
                },
                404,
            );
        }

        return c.json({
            success: true,
            collection,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete CMS collection.",
            },
            404,
        );
    }
}