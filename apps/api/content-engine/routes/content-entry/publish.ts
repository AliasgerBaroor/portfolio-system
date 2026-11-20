
import { Hono } from "hono";

import { Prisma } from "@prisma/client";

import { applicationCredentialMiddleware } from "../../../middleware/application-credential.middleware";
import { requireApplicationCredentialScope } from "../../../middleware/require-application-credential-scope.middleware";
import { requireApplicationEnvironment } from "../../../middleware/require-application-environment.middleware";

import {
    publishContentEntry,
    ContentEntryPublishError,
} from "../../services/content-entry/publish-content-entry.service";

const publish = new Hono();

publish.post(
    "/applications/:applicationId/environments/:environmentId/content-models/:modelId/entries/:entryId/publish",
    applicationCredentialMiddleware,
    requireApplicationEnvironment(),
    requireApplicationCredentialScope("content.write"),
    async (c) => {
        const {
            applicationId,
            environmentId,
            modelId,
            entryId,
        } = c.req.param();

        if (!applicationId || !environmentId || !modelId || !entryId) {
            return c.json(
                {
                    success: false,
                    message: "Required route parameters are missing.",
                },
                400,
            );
        }

        try {
            const entry = await publishContentEntry(
                applicationId,
                environmentId,
                modelId,
                entryId,
            );

            return c.json({
                success: true,
                message: "Content entry published successfully.",
                entry,
            });
        } catch (error) {
            if (error instanceof ContentEntryPublishError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    error.statusCode,
                );
            }

            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2034"
            ) {
                return c.json(
                    {
                        success: false,
                        message: "A concurrent publishing conflict occurred. Please retry.",
                    },
                    409,
                );
            }

            console.error("Failed to publish content entry:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to publish content entry.",
                },
                500,
            );
        }
    },
);

export default publish;
