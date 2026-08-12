import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth";

import { getClientAccessKeys } from "../../services/client-access-key/client-access-key.service";

import {
    toClientAccessKeyWithPasswordResponse,
} from "../../mappers/client-access-key.mapper";

const get = new Hono();

get.get(
    "/",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");

            const accessKeys =
                await getClientAccessKeys(
                    user.id
                );

            return c.json({
                success: true,

                accessKeys:
                    accessKeys.map(
                        toClientAccessKeyWithPasswordResponse
                    ),
            });
        } catch (error) {
            return c.json(
                {
                    success: false,

                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to get client access keys.",
                },
                400
            );
        }
    }
);

export default get;