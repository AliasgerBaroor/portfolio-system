import { Hono } from "hono";

import { authMiddleware } from "../../../middleware/auth";
import { getPortfolioSections } from "../../../services/portfolio/sections.service";

const sections = new Hono();

sections.get(
    "/",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");

            const result =
                await getPortfolioSections(user.id);

            return c.json({
                success: true,
                sections: result,
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to load portfolio sections.",
                },
                404
            );
        }
    }
);

export default sections;