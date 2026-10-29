import { Hono } from "hono";

import { authMiddleware } from "../../../middleware/auth";
import { createPortfolioSection } from "../../../services/portfolio/sections.service";

const create = new Hono();

create.post(
    "/",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");

            const body = await c.req.json();

            const result =
                await createPortfolioSection(
                    user.id,
                    body
                );

            return c.json({
                success: true,
                section: result,
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to create section.",
                },
                400
            );
        }
    }
);

export default create;