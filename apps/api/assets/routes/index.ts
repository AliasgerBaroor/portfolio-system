import { Hono } from "hono";

import upload from "./upload";
import get from "./get";
import download from "./download";
import remove from "./delete";
import reconcile from "./reconcile";

const assets = new Hono();

assets.route("/", upload);
assets.route("/", get);
assets.route("/", download);
assets.route("/", remove);
assets.route("/", reconcile);

export default assets;