import { Hono } from "hono";

import { authMiddleware } from "../../../../middleware/auth";

import {
    getCmsItemsHandler,
    getCmsItemHandler,
} from "./get";

import {
    createCmsItemHandler,
} from "./create";

import {
    updateCmsItemHandler,
} from "./update";

import {
    deleteCmsItemHandler,
} from "./delete";

const items = new Hono();

items.get(
    "/",
    authMiddleware,
    getCmsItemsHandler,
);

items.post(
    "/",
    authMiddleware,
    createCmsItemHandler,
);

items.get(
    "/:itemId",
    authMiddleware,
    getCmsItemHandler,
);

items.patch(
    "/:itemId",
    authMiddleware,
    updateCmsItemHandler,
);

items.delete(
    "/:itemId",
    authMiddleware,
    deleteCmsItemHandler,
);

export default items;