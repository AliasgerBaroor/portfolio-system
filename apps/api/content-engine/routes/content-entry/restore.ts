
import { Hono } from "hono";
import { Prisma } from "@prisma/client";

import { applicationCredentialMiddleware } from "../../../middleware/application-credential.middleware";
import { requireApplicationCredentialScope } from "../../../middleware/require-application-credential-scope.middleware";
import { requireApplicationEnvironment } from "../../../middleware/require-application-environment.middleware";

import {
    restoreContentEntry,
    ContentEntryRestoreError,
} from "../../services/content-entry/restore-content-entry.service";

const restore = new Hono();

restore.post(
    "/applications/:applicationId/environments/:environmentId/content-models/:modelId/entries/:entryId/restore",
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
            const entry = await restoreContentEntry(
                applicationId,
                environmentId,
                modelId,
                entryId,
            );

            return c.json({
                success: true,
                message: "Content entry restored successfully.",
                entry,
            });
        } catch (error) {
            if (error instanceof ContentEntryRestoreError) {
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
                        message: "A concurrent restoration conflict occurred. Please retry.",
                    },
                    409,
                );
            }

            console.error("Failed to restore content entry:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to restore content entry.",
                },
                500,
            );
        }
    },
);

export default restore;
