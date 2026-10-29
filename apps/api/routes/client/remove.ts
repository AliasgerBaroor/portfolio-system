import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth";

import {
    removeClient,
} from "../../services/client/client.service";

const remove = new Hono();

remove.delete(
    "/:clientId",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");

            const clientId =
                c.req.param("clientId");

            if (!clientId) {
                return c.json(
                    {
                        success: false,
                        message:
                            "Client ID is required.",
                    },
                    400
                );
            }

            const client =
                await removeClient(
                    user.id,
                    clientId
                );

            return c.json({
                success: true,
                client,
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to remove client.",
                },
                400
            );
        }
    }
);

export default remove;