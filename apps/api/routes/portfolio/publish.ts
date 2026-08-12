import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth";

import {
    publishPortfolio,
} from "../../services/portfolio/portfolio.service";

const publish = new Hono();

publish.post(
    "/publish",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");

            const portfolio =
                await publishPortfolio(
                    user.id
                );

            return c.json({
                success: true,
                portfolio,
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to publish portfolio.",
                },
                400
            );
        }
    }
);

export default publish;