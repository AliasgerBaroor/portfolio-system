
import { Hono } from "hono";
import { applicationCredentialMiddleware } from "../../../middleware/application-credential.middleware";
import { requireApplicationCredentialScope } from "../../../middleware/require-application-credential-scope.middleware";
import { requireApplicationEnvironment } from "../../../middleware/require-application-environment.middleware";
import {
    getContentEntry,
    ContentEntryRetrievalError,
} from "../../services/content-entry/get-content-entry.service";

const get = new Hono();

get.get(
    "/applications/:applicationId/environments/:environmentId/content-models/:modelId/entries/:entryId",
    applicationCredentialMiddleware,
    requireApplicationEnvironment(),
    requireApplicationCredentialScope("content.read"),
    async (c) => {
        const {
            applicationId,
            environmentId,
            modelId,
            entryId,
        } = c.req.param();

        if (!applicationId || !environmentId || !modelId || !entryId) {
            return c.json(
                { success: false, message: "Required route parameters are missing." },
                400,
            );
        }

        try {
            const entry = await getContentEntry(
                applicationId,
                environmentId,
                modelId,
                entryId,
            );

            return c.json({
                success: true,
                message: "Content entry retrieved successfully.",
                entry,
            });
        } catch (error) {
            if (error instanceof ContentEntryRetrievalError) {
                return c.json(
                    { success: false, message: error.message },
                    error.statusCode,
                );
            }

            console.error("Failed to retrieve content entry:", error);

            return c.json(
                { success: false, message: "Failed to retrieve content entry." },
                500,
            );
        }
    },
);

export default get;
