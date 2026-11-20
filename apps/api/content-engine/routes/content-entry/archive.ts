
import { Hono } from "hono";
import { Prisma } from "@prisma/client";

import { applicationCredentialMiddleware } from "../../../middleware/application-credential.middleware";
import { requireApplicationCredentialScope } from "../../../middleware/require-application-credential-scope.middleware";
import { requireApplicationEnvironment } from "../../../middleware/require-application-environment.middleware";

import {
    archiveContentEntry,
    ContentEntryArchiveError,
} from "../../services/content-entry/archive-content-entry.service";

const archive = new Hono();

archive.post(
    "/applications/:applicationId/environments/:environmentId/content-models/:modelId/entries/:entryId/archive",
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
            const entry = await archiveContentEntry(
                applicationId,
                environmentId,
                modelId,
                entryId,
            );

            return c.json({
                success: true,
                message: "Content entry archived successfully.",
                entry,
            });
        } catch (error) {
            if (error instanceof ContentEntryArchiveError) {
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
                        message: "A concurrent archive conflict occurred. Please retry.",
                    },
                    409,
                );
            }

            console.error("Failed to archive content entry:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to archive content entry.",
                },
                500,
            );
        }
    },
);

export default archive;
