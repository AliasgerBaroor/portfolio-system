import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth";

import {
    CreatePortfolioSchema,
} from "../../validators/portfolio";

import {
    createPortfolio,
} from "../../services/portfolio/portfolio.service";

const create = new Hono();

create.post(
    "/",
    authMiddleware,
    async (c) => {
        try {
            const body = await c.req.json();

            const result =
                CreatePortfolioSchema.safeParse(body);

            if (!result.success) {
                return c.json(
                    {
                        success: false,
                        errors: result.error.flatten(),
                    },
                    400
                );
            }

            const user = c.get("user");

            const portfolio =
                await createPortfolio(
                    user.id,
                    result.data.title,
                    result.data.slug
                );

            return c.json(
                {
                    success: true,
                    portfolio,
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
                            : "Failed to create portfolio.",
                },
                400
            );
        }
    }
);

export default create;