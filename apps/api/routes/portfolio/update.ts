import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth";

import {
    UpdatePortfolioSchema,
} from "../../validators/portfolio/portfolio";

import {
    updatePortfolio,
} from "../../services/portfolio/portfolio.service";

const update = new Hono();

update.patch(
    "/",
    authMiddleware,
    async (c) => {
        try {
            const body = await c.req.json();

            const result =
                UpdatePortfolioSchema.safeParse(body);

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

            const portfolio =
                await updatePortfolio(
                    user.id,
                    result.data
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
                            : "Failed to update portfolio.",
                },
                400
            );
        }
    }
);

export default update;