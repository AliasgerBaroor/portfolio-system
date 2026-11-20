
import { Hono } from "hono";

import { authMiddleware } from "../../../middleware/auth.middleware";
import {
    ApplicationPermissionError,
    requireApplicationPermission,
} from "../../../services/authorization/application-permission.service";

import { CreateContentModelSchema } from "../../validators/content-model/create-content-model.validator";
import { createContentModel } from "../../services/content-model/content-model.service";
import { CONTENT_PERMISSIONS } from "../../../constants/content-permissions";

const create = new Hono();

create.post("/", authMiddleware, async (c) => {
    const applicationId = c.req.param("applicationId");

    if (!applicationId) {
        return c.json(
            {
                success: false,
                message: "Application ID is required.",
            },
            400,
        );
    }

    try {
        const body = await c.req.json();
        const parsed = CreateContentModelSchema.safeParse(body);

        if (!parsed.success) {
            return c.json(
                {
                    success: false,
                    message: "Invalid content model data.",
                    errors: parsed.error.flatten(),
                },
                400,
            );
        }

        const user = c.get("user");

        await requireApplicationPermission(
            user.id,
            applicationId,
            CONTENT_PERMISSIONS.MODEL_CREATE,
        );

        const contentModel = await createContentModel(
            applicationId,
            user.id,
            parsed.data,
        );

        return c.json(
            {
                success: true,
                contentModel,
            },
            201,
        );
    } catch (error) {
        if (error instanceof ApplicationPermissionError) {
            return c.json(
                {
                    success: false,
                    message: error.message,
                },
                error.statusCode,
            );
        }

        console.error("Create content model error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to create content model.",
            },
            500,
        );
    }
});

export default create;