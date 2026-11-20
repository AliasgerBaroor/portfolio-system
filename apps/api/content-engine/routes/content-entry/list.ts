import { Hono } from "hono";

import {
    applicationCredentialMiddleware,
} from "../../../middleware/application-credential.middleware";

import {
    requireApplicationCredentialScope,
} from "../../../middleware/require-application-credential-scope.middleware";

import {
    requireApplicationEnvironment,
} from "../../../middleware/require-application-environment.middleware";

import {
    ContentEntryListingError,
    listContentEntries,
} from "../../services/content-entry/list-content-entries.service";

import {
    ListContentEntriesSchema,
} from "../../validators/content-entry/list-content-entries.validator";

const list = new Hono();

list.get(
    "/applications/:applicationId/environments/:environmentId/content-models/:modelId/entries",
    applicationCredentialMiddleware,
    requireApplicationEnvironment(),
    requireApplicationCredentialScope("content.read"),
    async (c) => {
        const { applicationId, environmentId, modelId } = c.req.param();

        if (!applicationId || !environmentId || !modelId) {
            return c.json(
                {
                    success: false,
                    message: "Application ID, environment ID, and model ID are required.",
                },
                400,
            );
        }

        const parsed = ListContentEntriesSchema.safeParse(c.req.query());

        if (!parsed.success) {
            return c.json(
                {
                    success: false,
                    message: "Invalid content entry query parameters.",
                    errors: parsed.error.flatten(),
                },
                400,
            );
        }

        try {
            const result = await listContentEntries(
                applicationId,
                environmentId,
                modelId,
                parsed.data,
            );

            return c.json({
                success: true,
                message: "Content entries retrieved successfully.",
                ...result,
            });
        } catch (error) {
            if (error instanceof ContentEntryListingError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    error.statusCode,
                );
            }

            console.error("List content entries error:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to retrieve content entries.",
                },
                500,
            );
        }
    },
);

export default list;