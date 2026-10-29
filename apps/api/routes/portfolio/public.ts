import { Hono } from "hono";

import {
    getPublicPortfolio,
} from "../../services/portfolio/public-portfolio.service";

const publicPortfolio =
    new Hono();

publicPortfolio.get(
    "/:slug",
    async (c) => {
        try {
            const slug =
                c.req.param("slug");

            if (!slug) {
                return c.json(
                    {
                        success: false,
                        message:
                            "Portfolio slug is required.",
                    },
                    400
                );
            }

            const portfolio =
                await getPublicPortfolio(
                    slug
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
                            : "Portfolio not found.",
                },
                404
            );
        }
    }
);

export default publicPortfolio;