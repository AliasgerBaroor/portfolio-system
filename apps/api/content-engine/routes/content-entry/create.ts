
import { Hono } from "hono";
import { Prisma } from "@prisma/client";

import { applicationCredentialMiddleware } from "../../../middleware/application-credential.middleware";
import { requireApplicationCredentialScope } from "../../../middleware/require-application-credential-scope.middleware";
import { requireApplicationEnvironment } from "../../../middleware/require-application-environment.middleware";

import {
    ContentEntryCreationError,
    createContentEntry,
} from "../../services/content-entry/content-entry.service";

import { CreateContentEntrySchema } from "../../validators/content-entry/create-content-entry.validator";

const create = new Hono();

create.post(
    "/applications/:applicationId/environments/:environmentId/content-models/:modelId/entries",
    applicationCredentialMiddleware,
    requireApplicationEnvironment(),
    requireApplicationCredentialScope("content.write"),
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

        try {
            const body = await c.req.json();
            const parsed = CreateContentEntrySchema.safeParse(body);

            if (!parsed.success) {
                return c.json(
                    {
                        success: false,
                        message: "Invalid content entry data.",
                        errors: parsed.error.flatten(),
                    },
                    400,
                );
            }

            const entry = await createContentEntry(
                applicationId,
                environmentId,
                modelId,
                parsed.data,
            );

            return c.json(
                {
                    success: true,
                    message: "Content entry created successfully.",
                    entry,
                },
                201,
            );
        } catch (error) {
            if (error instanceof ContentEntryCreationError) {
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
                return c.json(
                    {
                        success: false,
                        message: "A content entry with this unique value already exists.",
                    },
                    409,
                );
            }

            console.error("Create content entry error:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to create content entry.",
                },
                500,
            );
        }
    },
);

export default create;
