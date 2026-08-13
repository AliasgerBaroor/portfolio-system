import { Hono } from "hono";

import create from "./create";
import get from "./get";

const client = new Hono();

client.route("/", create);
client.route("/", get);

export default client;