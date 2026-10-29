import { Hono } from "hono";

import create from "./create";
import get from "./get";
import update from "./update";
import publish from "./publish";
import clientGet from "./client-get";
import publicPortfolio from "./public";
import sections from "./sections";
import cms from "./cms";
import { deletePortfolioHandler } from "./delete";

import { authMiddleware } from "../../middleware/auth";

const portfolio = new Hono();

portfolio.route("/", create);
portfolio.route("/", get);
portfolio.route("/", update);
portfolio.route("/", publish);

portfolio.delete(
    "/",
    authMiddleware,
    deletePortfolioHandler,
);

portfolio.route("/sections", sections);

// CMS routes
portfolio.route("/cms", cms);

portfolio.route("/", clientGet);
portfolio.route("/", publicPortfolio);

export default portfolio;