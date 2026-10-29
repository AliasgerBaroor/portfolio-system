import { Hono } from "hono";

import {
    getCmsBlocksHandler,
} from "./get";

import {
    createCmsBlockHandler,
} from "./create";

import {
    updateCmsBlockHandler,
} from "./update";

import {
    deleteCmsBlockHandler,
} from "./delete";

import { authMiddleware } from "../../../../middleware/auth";

const blocks = new Hono();

blocks.get(
    "/",
    authMiddleware,
    getCmsBlocksHandler,
);

blocks.post(
    "/",
    authMiddleware,
    createCmsBlockHandler,
);

blocks.patch(
    "/:blockId",
    authMiddleware,
    updateCmsBlockHandler,
);

blocks.delete(
    "/:blockId",
    authMiddleware,
    deleteCmsBlockHandler,
);

export default blocks;