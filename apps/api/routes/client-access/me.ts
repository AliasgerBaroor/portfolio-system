import { Hono } from "hono";

import { clientAccessMiddleware } from "../../middleware/client-access";

const me = new Hono();

me.get(
    "/",
    clientAccessMiddleware,
    async (c) => {
        const session =
            c.get(
                "clientAccessSession"
            );

        return c.json({
            success: true,
            session: {
                id: session.id,
                accessKeyId:
                    session.accessKeyId,
                expiresAt:
                    session.expiresAt,
            },
        });
    }
);

export default me;