import { Hono } from "hono";

import create from "./create";
import list from "./list";
import get from "./get";
import update from "./update";
import publish from "./publish";
import archive from "./archive";
import restore from "./restore";
import remove from "./delete";

const contentEntry = new Hono();

contentEntry.route("/", create);
contentEntry.route("/", list);
contentEntry.route("/", get);
contentEntry.route("/", update);
contentEntry.route("/", publish);
contentEntry.route("/", archive);
contentEntry.route("/", restore);
contentEntry.route("/", remove);

export default contentEntry;