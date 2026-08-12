import { Hono } from "hono";

import { clientAccessMiddleware } from "../../middleware/client-access";

import { getClientPortfolio } from "../../services/portfolio/client-portfolio.service";

const clientGet = new Hono();

clientGet.get(
    "/:slug",
    clientAccessMiddleware,
    async (c) => {
        try {
            const slug = c.req.param("slug");

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

            const session =
                c.get("clientAccessSession");

            const portfolio =
                await getClientPortfolio(
                    slug,
                    session.accessKeyId
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
                            : "Failed to access portfolio.",
                },
                403
            );
        }
    }
);

export default clientGet;