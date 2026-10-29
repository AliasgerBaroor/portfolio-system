import { Hono } from "hono";

import create from "./create";
import get from "./get";
import remove from "./remove";

const client = new Hono();

client.route("/", create);
client.route("/", get);
client.route("/", remove);

export default client;