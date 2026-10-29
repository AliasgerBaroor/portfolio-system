import type { Context } from "hono";

import {
    updateCmsCollection,
} from "../../../../services/portfolio/cms/collections.service";

export async function updateCmsCollectionHandler(
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

        const body = await c.req.json();

        const collection =
            await updateCmsCollection(
                user.id,
                collectionId,
                {
                    name: body.name,
                    slug: body.slug,
                    description: body.description,
                    isEnabled: body.isEnabled,
                    sortOrder: body.sortOrder,
                },
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
                        : "Failed to update CMS collection.",
            },
            404,
        );
    }
}