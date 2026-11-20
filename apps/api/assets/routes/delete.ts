
import { Hono } from "hono";

import { applicationCredentialMiddleware } from "../../middleware/application-credential.middleware";
import { requireApplicationEnvironment } from "../../middleware/require-application-environment.middleware";
import { requireApplicationCredentialScope } from "../../middleware/require-application-credential-scope.middleware";

import { AssetNotFoundError } from "../services/get-asset.service";
import { AssetDeletionError, deleteAsset } from "../services/delete-asset.service";

const remove = new Hono();

remove.delete(
    "/applications/:applicationId/environments/:environmentId/assets/:assetId",
    applicationCredentialMiddleware,
    requireApplicationEnvironment(),
    requireApplicationCredentialScope("assets.write"),
    async (c) => {
        const applicationId = c.req.param("applicationId");
        const environmentId = c.req.param("environmentId");
        const assetId = c.req.param("assetId");

        if (!applicationId || !environmentId || !assetId) {
            return c.json({
                success: false,
                message: "Application, environment, and asset IDs are required.",
            }, 400);
        }

        try {
            const asset = await deleteAsset({
                applicationId,
                environmentId,
                assetId,
            });

            return c.json({
                success: true,
                message: "Asset deleted successfully.",
                asset,
            });
        } catch (error) {
            if (error instanceof AssetNotFoundError) {
                return c.json({
                    success: false,
                    message: error.message,
                }, 404);
            }

            if (error instanceof AssetDeletionError) {
                return c.json({
                    success: false,
                    message: error.message,
                }, 500);
            }

            console.error("Asset deletion route error:", error);

            return c.json({
                success: false,
                message: "Failed to delete asset.",
            }, 500);
        }
    },
);

export default remove;
