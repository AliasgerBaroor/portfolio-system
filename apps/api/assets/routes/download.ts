
import { Hono } from "hono";

import { applicationCredentialMiddleware } from "../../middleware/application-credential.middleware";
import { requireApplicationEnvironment } from "../../middleware/require-application-environment.middleware";
import { requireApplicationCredentialScope } from "../../middleware/require-application-credential-scope.middleware";

import { AssetNotFoundError } from "../services/get-asset.service";
import { getAssetDownload } from "../services/get-asset-download.service";

const download = new Hono();

download.get(
    "/applications/:applicationId/environments/:environmentId/assets/:assetId/download",
    applicationCredentialMiddleware,
    requireApplicationEnvironment(),
    requireApplicationCredentialScope("assets.read"),
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
            const result = await getAssetDownload({
                applicationId,
                environmentId,
                assetId,
            });

            return c.json({
                success: true,
                download: result,
            });
        } catch (error) {
            if (error instanceof AssetNotFoundError) {
                return c.json({
                    success: false,
                    message: error.message,
                }, 404);
            }

            console.error("Asset download route error:", error);

            return c.json({
                success: false,
                message: "Failed to generate asset download URL.",
            }, 500);
        }
    },
);

export default download;
