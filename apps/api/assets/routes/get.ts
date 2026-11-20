
import { Hono } from "hono";

import { applicationCredentialMiddleware } from "../../middleware/application-credential.middleware";
import { requireApplicationEnvironment } from "../../middleware/require-application-environment.middleware";
import { requireApplicationCredentialScope } from "../../middleware/require-application-credential-scope.middleware";

import {
    AssetNotFoundError,
    getAsset,
} from "../services/get-asset.service";

const get = new Hono();

get.get(
    "/applications/:applicationId/environments/:environmentId/assets/:assetId",
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
            const asset = await getAsset({
                applicationId,
                environmentId,
                assetId,
            });

            return c.json({
                success: true,
                asset,
            });
        } catch (error) {
            if (error instanceof AssetNotFoundError) {
                return c.json({
                    success: false,
                    message: error.message,
                }, 404);
            }

            console.error("Asset retrieval route error:", error);

            return c.json({
                success: false,
                message: "Failed to retrieve asset.",
            }, 500);
        }
    },
);

export default get;
