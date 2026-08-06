import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth";
import { getPortfolio } from "../../services/portfolio/portfolio.service";

const portfolio = new Hono();

portfolio.get(
    "/",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");

            const result =
                await getPortfolio(user.id);

            return c.json({
                success: true,
                portfolio: result,
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to load portfolio.",
                },
                404
            );
        }
    }
);

export default portfolio;