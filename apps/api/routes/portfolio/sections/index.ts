import { Hono } from "hono";
import get from "./get";
import create from "./create";
import blocks from "./blocks";

const sections = new Hono();

sections.route("/", get);
sections.route("/", create);
sections.route("/", blocks);

export default sections;