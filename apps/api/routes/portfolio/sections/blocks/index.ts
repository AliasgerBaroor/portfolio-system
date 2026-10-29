import { Hono } from "hono";
import get from "./get";
import create from "./create";
import reorder from "./reorder";
import update from "./update";
import remove from "./delete";
import visibility from "./visibility";

const blocks = new Hono();

blocks.route("/", get);
blocks.route("/", create);
blocks.route("/", reorder);
blocks.route("/", update);
blocks.route("/", remove);
blocks.route("/", visibility);

export default blocks;