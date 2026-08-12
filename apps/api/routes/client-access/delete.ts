import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth";

import { revokeClientAccessKey } from "../../services/client-access-key/client-access-key.service";

const remove = new Hono();

remove.delete(
    "/:id",
    authMiddleware,
    async (c) => {
        try {
            const accessKeyId =
                c.req.param("id");

            if (!accessKeyId) {
                return c.json(
                    {
                        success: false,
                        message:
                            "Client access key ID is required.",
                    },
                    400
                );
            }

            const user =
                c.get("user");

            const result =
                await revokeClientAccessKey(
                    user.id,
                    accessKeyId
                );

            return c.json({
                success: true,
                id: result.id,
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to revoke client access.",
                },
                400
            );
        }
    }
);

export default remove;