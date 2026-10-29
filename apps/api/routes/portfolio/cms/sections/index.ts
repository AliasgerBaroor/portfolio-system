import { Hono } from "hono";

import { authMiddleware } from "../../../../middleware/auth";

import {
    getCmsSectionsHandler,
    getCmsSectionHandler,
} from "./get";

import {
    createCmsSectionHandler,
} from "./create";

import {
    updateCmsSectionHandler,
} from "./update";

import {
    deleteCmsSectionHandler,
} from "./delete";

const sections = new Hono();

sections.get(
    "/",
    authMiddleware,
    getCmsSectionsHandler,
);

sections.post(
    "/",
    authMiddleware,
    createCmsSectionHandler,
);

sections.get(
    "/:sectionId",
    authMiddleware,
    getCmsSectionHandler,
);

sections.patch(
    "/:sectionId",
    authMiddleware,
    updateCmsSectionHandler,
);

sections.delete(
    "/:sectionId",
    authMiddleware,
    deleteCmsSectionHandler,
);

export default sections;