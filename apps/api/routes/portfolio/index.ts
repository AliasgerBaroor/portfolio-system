import { Hono } from "hono";

import create from "./create";
import get from "./get";
import update from "./update";

const portfolio = new Hono();

portfolio.route("/", create);
portfolio.route("/", get);
portfolio.route("/", update);

export default portfolio;