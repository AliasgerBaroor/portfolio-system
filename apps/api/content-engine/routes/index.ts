import { Hono } from "hono";

import contentModel from "./content-model";
import contentEntry from "./content-entry";

import assets from "../../assets/routes";

const contentEngine = new Hono();

contentEngine.route(
    "/applications/:applicationId/content-models",
    contentModel,
);

contentEngine.route("/", contentEntry);
contentEngine.route("/", assets);

export default contentEngine;