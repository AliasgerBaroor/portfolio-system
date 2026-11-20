import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    validateAsset,
    sanitizeFilename,
} from "./asset.rules";

describe("Asset validation", () => {
    it("accepts a supported image", () => {
        const result = validateAsset({
            category: "IMAGE",
            filename: "cover.png",
            mimeType: "image/png",
            sizeBytes: 1024,
        });

        assert.equal(result.valid, true);
        assert.deepEqual(result.errors, []);
    });

    it("rejects SVG images", () => {
        const result = validateAsset({
            category: "IMAGE",
            filename: "image.svg",
            mimeType: "image/svg+xml",
            sizeBytes: 1024,
        });

        assert.equal(result.valid, false);
    });

    it("rejects unsupported document types", () => {
        const result = validateAsset({
            category: "FILE",
            filename: "program.exe",
            mimeType: "application/x-msdownload",
            sizeBytes: 1024,
        });

        assert.equal(result.valid, false);
    });

    it("rejects files exceeding IMAGE limits", () => {
        const result = validateAsset({
            category: "IMAGE",
            filename: "large.png",
            mimeType: "image/png",
            sizeBytes: 10 * 1024 * 1024 + 1,
        });

        assert.equal(result.valid, false);
    });

    it("rejects files exceeding FILE limits", () => {
        const result = validateAsset({
            category: "FILE",
            filename: "large.pdf",
            mimeType: "application/pdf",
            sizeBytes: 25 * 1024 * 1024 + 1,
        });

        assert.equal(result.valid, false);
    });

    it("rejects empty and invalid file sizes", () => {
        for (const sizeBytes of [0, -1, NaN, Infinity, 1.5]) {
            const result = validateAsset({
                category: "FILE",
                filename: "document.pdf",
                mimeType: "application/pdf",
                sizeBytes,
            });

            assert.equal(result.valid, false);
        }
    });

    it("sanitizes path traversal in filenames", () => {
        assert.equal(
            sanitizeFilename("../../secret.pdf"),
            "secret.pdf",
        );
    });

    it("removes control characters from filenames", () => {
        assert.equal(
            sanitizeFilename("report\u0000.pdf"),
            "report.pdf",
        );
    });

    it("rejects an empty sanitized filename", () => {
        const result = validateAsset({
            category: "FILE",
            filename: "../../",
            mimeType: "application/pdf",
            sizeBytes: 1024,
        });

        assert.equal(result.valid, false);
    });
});