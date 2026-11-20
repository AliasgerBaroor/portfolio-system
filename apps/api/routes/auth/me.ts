import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth.middleware";

const me = new Hono();

me.get("/", authMiddleware, (c) => {
    return c.json({
        success: true,
        user: c.get("user"),
    });
});

export default me;