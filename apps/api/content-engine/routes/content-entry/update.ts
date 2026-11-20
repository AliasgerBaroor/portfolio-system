
import { Hono } from "hono";
import { Prisma } from "@prisma/client";

import { applicationCredentialMiddleware } from "../../../middleware/application-credential.middleware";
import { requireApplicationCredentialScope } from "../../../middleware/require-application-credential-scope.middleware";
import { requireApplicationEnvironment } from "../../../middleware/require-application-environment.middleware";

import {
    updateContentEntry,
    ContentEntryUpdateError,
} from "../../services/content-entry/update-content-entry.service";

import { UpdateContentEntrySchema } from "../../validators/content-entry/update-content-entry.validator";

const update = new Hono();

update.patch(
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

        const body = await c.req.json().catch(() => null);
        const parsed = UpdateContentEntrySchema.safeParse(body);

        if (!parsed.success) {
            return c.json(
                {
                    success: false,
                    message: "Invalid content entry update.",
                    errors: parsed.error.flatten(),
                },
                400,
            );
        }

        try {
            const entry = await updateContentEntry(
                applicationId,
                environmentId,
                modelId,
                entryId,
                parsed.data,
            );

            return c.json({
                success: true,
                message: "Content entry updated successfully.",
                entry,
            });
        } catch (error) {
            if (error instanceof ContentEntryUpdateError) {
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
                error.code === "P2002"
            ) {
                console.error("Content entry update P2002:", {
                    meta: error.meta,
                    message: error.message,
                });
                return c.json(
                    {
                        success: false,
                        message: "A content entry with this unique value already exists.",
                    },
                    409,
                );
            }

            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2034"
            ) {
                return c.json(
                    {
                        success: false,
                        message: "A concurrent update conflict occurred. Please retry.",
                    },
                    409,
                );
            }

            console.error("Failed to update content entry:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to update content entry.",
                },
                500,
            );
        }
    },
);

export default update;
