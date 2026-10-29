import type { Context } from "hono";

import {
    getCmsCollection,
    getCmsCollections,
} from "../../../../services/portfolio/cms/collections.service";

export async function getCmsCollectionsHandler(
    c: Context,
) {
    try {
        const user = c.get("user");

        const result =
            await getCmsCollections(user.id);

        return c.json({
            success: true,
            collections: result,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to load CMS collections.",
            },
            404,
        );
    }
}

export async function getCmsCollectionHandler(
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

        const result =
            await getCmsCollection(
                user.id,
                collectionId,
            );

        if (!result) {
            return c.json(
                {
                    success: false,
                    message: "CMS collection not found.",
                },
                404,
            );
        }

        return c.json({
            success: true,
            collection: result,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to load CMS collection.",
            },
            404,
        );
    }
}