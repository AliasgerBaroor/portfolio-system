import { Hono } from "hono";

import create from "./create";
import get from "./get";
import update from "./update";
import publish from "./publish";
import clientGet from "./client-get";

const portfolio = new Hono();

portfolio.route("/", create);
portfolio.route("/", get);
portfolio.route("/", update);
portfolio.route("/", publish);
portfolio.route("/", clientGet);

export default portfolio;