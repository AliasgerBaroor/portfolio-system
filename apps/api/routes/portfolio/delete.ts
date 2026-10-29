import type { Context } from "hono";

import { deletePortfolio } from "../../services/portfolio/portfolio.service";

export async function deletePortfolioHandler(
    c: Context,
) {
    try {
        const user = c.get("user");

        const portfolio =
            await deletePortfolio(user.id);

        if (!portfolio) {
            return c.json(
                {
                    success: false,
                    message: "Portfolio not found.",
                },
                404,
            );
        }

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
                        : "Failed to delete portfolio.",
            },
            400,
        );
    }
}