import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth";

import {
    CreateClientSchema,
} from "../../validators/client";

import {
    createClient,
} from "../../services/client/client.service";

const create = new Hono();

create.post(
    "/",
    authMiddleware,
    async (c) => {
        try {
            const body =
                await c.req.json();

            const result =
                CreateClientSchema.safeParse(
                    body
                );

            if (!result.success) {
                return c.json(
                    {
                        success: false,
                        errors:
                            result.error.flatten(),
                    },
                    400
                );
            }

            const user =
                c.get("user");

            const client =
                await createClient(
                    user.id,
                    result.data
                );

            return c.json(
                {
                    success: true,
                    client,
                },
                201
            );
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to create client.",
                },
                400
            );
        }
    }
);

export default create;