
import { Hono } from "hono";

import { authMiddleware } from "../../../middleware/auth.middleware";
import {
    ApplicationPermissionError,
    requireApplicationPermission,
} from "../../../services/authorization/application-permission.service";
import { CONTENT_PERMISSIONS } from "../../../constants/content-permissions";

import {
    ContentModelLifecycleError,
    manageContentModelLifecycle,
} from "../../services/content-model/manage-content-model-lifecycle.service";

const lifecycle = new Hono();

const actions = {
    activate: {
        permission: CONTENT_PERMISSIONS.MODEL_UPDATE,
        action: "ACTIVATE",
    },
    archive: {
        permission: CONTENT_PERMISSIONS.MODEL_ARCHIVE,
        action: "ARCHIVE",
    },
    restore: {
        permission: CONTENT_PERMISSIONS.MODEL_UPDATE,
        action: "RESTORE",
    },
} as const;

for (const [operation, config] of Object.entries(actions)) {
    lifecycle.post(
        `/:modelId/${operation}`,
        authMiddleware,
        async (c) => {
            const applicationId = c.req.param("applicationId");
            const modelId = c.req.param("modelId");

            if (!applicationId || !modelId) {
                return c.json(
                    {
                        success: false,
                        message: "Application ID and model ID are required.",
                    },
                    400,
                );
            }

            try {
                const user = c.get("user");

                await requireApplicationPermission(
                    user.id,
                    applicationId,
                    config.permission,
                );

                const contentModel = await manageContentModelLifecycle(
                    applicationId,
                    modelId,
                    config.action,
                );

                return c.json({
                    success: true,
                    message: `Content model ${operation}d successfully.`,
                    contentModel,
                });
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

                if (error instanceof ContentModelLifecycleError) {
                    return c.json(
                        {
                            success: false,
                            message: error.message,
                        },
                        error.statusCode,
                    );
                }

                console.error("Content model lifecycle error:", error);

                return c.json(
                    {
                        success: false,
                        message: "Failed to update content model lifecycle.",
                    },
                    500,
                );
            }
        },
    );
}

export default lifecycle;
