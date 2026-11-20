
import { Hono } from "hono";
import { Prisma } from "@prisma/client";

import { applicationCredentialMiddleware } from "../../../middleware/application-credential.middleware";
import { requireApplicationCredentialScope } from "../../../middleware/require-application-credential-scope.middleware";
import { requireApplicationEnvironment } from "../../../middleware/require-application-environment.middleware";

import {
    deleteContentEntry,
    ContentEntryDeleteError,
} from "../../services/content-entry/delete-content-entry.service";

const remove = new Hono();

remove.delete(
    "/applications/:applicationId/environments/:environmentId/content-models/:modelId/entries/:entryId",
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
            const entry = await deleteContentEntry(
                applicationId,
                environmentId,
                modelId,
                entryId,
            );

            return c.json({
                success: true,
                message: "Content entry deleted successfully.",
                entry,
            });
        } catch (error) {
            if (error instanceof ContentEntryDeleteError) {
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
                        message: "A concurrent deletion conflict occurred. Please retry.",
                    },
                    409,
                );
            }

            console.error("Failed to delete content entry:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to delete content entry.",
                },
                500,
            );
        }
    },
);

export default remove;
