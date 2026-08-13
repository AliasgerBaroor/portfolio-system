import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth";

import {
    getClients,
} from "../../services/client/client.service";

const get = new Hono();

get.get(
    "/",
    authMiddleware,
    async (c) => {
        try {
            const user =
                c.get("user");

            const clients =
                await getClients(
                    user.id
                );

            return c.json({
                success: true,
                clients,
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to get clients.",
                },
                400
            );
        }
    }
);

export default get;