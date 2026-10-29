import { Hono } from "hono";

import { authMiddleware } from "../../../../middleware/auth";

import {
    getCmsCollectionsHandler,
    getCmsCollectionHandler,
} from "./get";

import {
    createCmsCollectionHandler,
} from "./create";

import {
    updateCmsCollectionHandler,
} from "./update";

import {
    deleteCmsCollectionHandler,
} from "./delete";

const collections = new Hono();

collections.get(
    "/",
    authMiddleware,
    getCmsCollectionsHandler,
);

collections.post(
    "/",
    authMiddleware,
    createCmsCollectionHandler,
);

collections.get(
    "/:collectionId",
    authMiddleware,
    getCmsCollectionHandler,
);

collections.patch(
    "/:collectionId",
    authMiddleware,
    updateCmsCollectionHandler,
);

collections.delete(
    "/:collectionId",
    authMiddleware,
    deleteCmsCollectionHandler,
);

export default collections;