import { Hono } from "hono";

import create from "./create";
import get from "./get";
import login from "./login/login";
import me from "./me";
import remove from "./delete";

const clientAccessKey = new Hono();

clientAccessKey.route("/", create);
clientAccessKey.route("/", get);
clientAccessKey.route("/:slug/access", login);
clientAccessKey.route("/me", me);
clientAccessKey.route("/", remove);

export default clientAccessKey;