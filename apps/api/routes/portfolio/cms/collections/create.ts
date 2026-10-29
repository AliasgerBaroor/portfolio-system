import type { Context } from "hono";

import {
    createCmsCollection,
} from "../../../../services/portfolio/cms/collections.service";

export async function createCmsCollectionHandler(
    c: Context,
) {
    try {
        const user = c.get("user");

        const body = await c.req.json();

        const collection =
            await createCmsCollection(
                user.id,
                {
                    name: body.name,
                    slug: body.slug,
                    description: body.description,
                    sortOrder: body.sortOrder,
                },
            );

        return c.json(
            {
                success: true,
                collection,
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
                        : "Failed to create CMS collection.",
            },
            404,
        );
    }
}