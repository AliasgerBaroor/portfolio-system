
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";

import { applicationCredentialMiddleware } from "../../middleware/application-credential.middleware";
import { requireApplicationEnvironment } from "../../middleware/require-application-environment.middleware";
import { requireApplicationCredentialScope } from "../../middleware/require-application-credential-scope.middleware";

import {
    AssetUploadError,
    uploadAsset,
} from "../services/upload-asset.service";

const upload = new Hono();

upload.post(
    "/applications/:applicationId/environments/:environmentId/assets",
    bodyLimit({
        maxSize: 26 * 1024 * 1024,
        onError: (c) =>
            c.json({
                success: false,
                message: "Request exceeds the maximum allowed upload size.",
            }, 413),
    }),
    applicationCredentialMiddleware,
    requireApplicationEnvironment(),
    requireApplicationCredentialScope("assets.write"),
    async (c) => {
        const { applicationId, environmentId } = c.req.param();
        const credential = c.get("applicationCredential");

        try {
            const formData = await c.req.formData();

            const file = formData.get("file");
            const category = formData.get("category");

            if (!(file instanceof File)) {
                return c.json({
                    success: false,
                    message: "A file is required.",
                }, 400);
            }

            if (category !== "IMAGE" && category !== "FILE") {
                return c.json({
                    success: false,
                    message: "Category must be IMAGE or FILE.",
                }, 400);
            }

            const asset = await uploadAsset({
                applicationId,
                environmentId,
                credentialId: credential.id,
                category,
                filename: file.name,
                mimeType: file.type,
                body: new Uint8Array(await file.arrayBuffer()),
            });

            return c.json({
                success: true,
                message: "Asset uploaded successfully.",
                asset,
            }, 201);
        } catch (error) {
            if (error instanceof AssetUploadError) {
                return c.json({
                    success: false,
                    message: error.message,
                }, error.statusCode);
            }

            console.error("Asset upload route error:", error);

            return c.json({
                success: false,
                message: "Failed to upload asset.",
            }, 500);
        }
    },
);

export default upload;
