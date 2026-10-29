import { Hono } from "hono";

import collections from "./collections";
import items from "./items";
import sections from "./sections";
import blocks from "./blocks";

const cms = new Hono();

cms.route("/collections", collections);

cms.route(
    "/collections/:collectionId/items",
    items,
);

cms.route(
    "/items/:itemId/sections",
    sections,
);

cms.route(
    "/sections/:sectionId/blocks",
    blocks,
);

export default cms;