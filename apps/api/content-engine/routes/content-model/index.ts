
import { Hono } from "hono";
import create from "./create";
import lifecycle from "./lifecycle";

const contentModel = new Hono();

contentModel.route("/", create);
contentModel.route("/", lifecycle);

export default contentModel;
