import { Hono } from "hono";

import get from "./get";
import create from "./create";

const portfolio = new Hono();

portfolio.route("/", get);
portfolio.route("/", create);

export default portfolio;