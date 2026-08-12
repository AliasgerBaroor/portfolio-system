import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth";

import { CreateClientAccessKeySchema } from "../../validators/client-access-key";

import { createClientAccessKey } from "../../services/client-access-key/client-access-key.service";
import { toClientAccessKeyResponse } from "../../mappers/client-access-key.mapper";

const create = new Hono();

create.post(
    "/",
    authMiddleware,
    async (c) => {
        try {
            const body = await c.req.json();

            const result =
                CreateClientAccessKeySchema.safeParse(body);

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

            const user = c.get("user");

            const response =
                await createClientAccessKey(
                    user.id,
                    result.data
                );

            return c.json({
                success: true,
                password: response.password,
                accessKey: toClientAccessKeyResponse(
                    response.accessKey
                ),
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to create client access key.",
                },
                400
            );
        }
    }
);

export default create;