import { Hono } from "hono";

import login from "./login";
import refresh from "./refresh";
import logout from "./logout";
import me from "./me";

const auth = new Hono();

auth.route("/login", login);
auth.route("/refresh", refresh);
auth.route("/logout", logout);

auth.route("/me", me);

export default auth;