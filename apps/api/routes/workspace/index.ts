
import { Hono } from "hono";

import create from "./create";
import list from "./list";
import details from "./details";
import update from "./update";
import remove from "./delete";
import members from "./members";
import invitations from "./invitations";
import roles from "./roles";
import applications from "./applications";

const workspace = new Hono();

workspace.route("/", create);
workspace.route("/", list);
workspace.route("/", details);
workspace.route("/", update);
workspace.route("/", remove);
workspace.route("/", members);
workspace.route("/", invitations);
workspace.route("/", roles);
workspace.route("/", applications);

export default workspace;
