
import { Buffer } from "node:buffer";
import yauzl from "yauzl";

import type { AssetCategory } from "./asset.rules";

export type SupportedAssetMimeType =
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "image/gif"
    | "application/pdf"
    | "text/plain"
    | "text/csv"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export interface AssetContentValidationInput {
    category: AssetCategory;
    mimeType: SupportedAssetMimeType;
    body: Uint8Array;
}

const SIGNATURES = {
    JPEG: Buffer.from([0xff, 0xd8, 0xff]),
    PNG: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    GIF87A: Buffer.from("GIF87a"),
    GIF89A: Buffer.from("GIF89a"),
    PDF: Buffer.from("%PDF-"),
} as const;

function startsWith(
    body: Uint8Array,
    signature: Uint8Array,
): boolean {
    return (
        body.length >= signature.length &&
        signature.every((byte, index) => body[index] === byte)
    );
}

function isWebP(body: Uint8Array): boolean {
    return (
        body.length >= 12 &&
        body[0] === 0x52 &&
        body[1] === 0x49 &&
        body[2] === 0x46 &&
        body[3] === 0x46 &&
        body[8] === 0x57 &&
        body[9] === 0x45 &&
        body[10] === 0x42 &&
        body[11] === 0x50
    );
}

function isUtf8Text(body: Uint8Array): boolean {
    if (body.includes(0)) return false;

    try {
        new TextDecoder("utf-8", { fatal: true }).decode(body);
        return true;
    } catch {
        return false;
    }
}

const OFFICE_ARCHIVE_LIMITS = {
    maxEntries: 2000,
    maxTotalUncompressedBytes: 30 * 1024 * 1024,
    maxEntryUncompressedBytes: 25 * 1024 * 1024,
    maxCompressionRatio: 100,
} as const;

function inspectOfficeArchive(
    body: Uint8Array,
    expectedDocument: string,
): Promise<boolean> {
    return new Promise((resolve) => {
        yauzl.fromBuffer(
            Buffer.from(body),
            {
                lazyEntries: true,
                decodeStrings: true,
                validateEntrySizes: true,
            },
            (error, zipFile) => {
                if (error || !zipFile) {
                    resolve(false);
                    return;
                }

                const requiredEntries = new Set([
                    "[Content_Types].xml",
                    expectedDocument,
                ]);

                let entryCount = 0;
                let totalUncompressedBytes = 0;
                let invalid = false;
                let finished = false;

                const finish = (valid: boolean) => {
                    if (finished) return;

                    finished = true;
                    zipFile.close();
                    resolve(valid);
                };

                zipFile.on("error", () => finish(false));

                zipFile.on("entry", (entry) => {
                    entryCount++;

                    const { fileName, uncompressedSize, compressedSize } =
                        entry;

                    if (
                        entryCount > OFFICE_ARCHIVE_LIMITS.maxEntries ||
                        fileName.startsWith("/") ||
                        fileName.split("/").includes("..") ||
                        fileName.includes("\\") ||
                        fileName.includes("\0") ||
                        entry.isEncrypted()
                    ) {
                        invalid = true;
                        finish(false);
                        return;
                    }

                    if (
                        uncompressedSize >
                        OFFICE_ARCHIVE_LIMITS.maxEntryUncompressedBytes
                    ) {
                        invalid = true;
                        finish(false);
                        return;
                    }

                    totalUncompressedBytes += uncompressedSize;

                    if (
                        totalUncompressedBytes >
                        OFFICE_ARCHIVE_LIMITS.maxTotalUncompressedBytes
                    ) {
                        invalid = true;
                        finish(false);
                        return;
                    }

                    if (uncompressedSize > 0) {
                        if (compressedSize === 0) {
                            invalid = true;
                            finish(false);
                            return;
                        }

                        if (
                            uncompressedSize / compressedSize >
                            OFFICE_ARCHIVE_LIMITS.maxCompressionRatio
                        ) {
                            invalid = true;
                            finish(false);
                            return;
                        }
                    }

                    requiredEntries.delete(fileName);

                    // Continue through the entire archive.
                    zipFile.readEntry();
                });

                zipFile.on("end", () => {
                    finish(
                        !invalid &&
                        requiredEntries.size === 0,
                    );
                });

                zipFile.readEntry();
            },
        );
    });
}

export async function validateAssetContent(
    input: AssetContentValidationInput,
): Promise<boolean> {
    const { body, mimeType, category } = input;

    if (body.byteLength === 0) return false;

    const imageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    ];

    if (category === "IMAGE" && !imageTypes.includes(mimeType)) {
        return false;
    }

    if (category === "FILE" && imageTypes.includes(mimeType)) {
        return false;
    }

    switch (mimeType) {
        case "image/jpeg":
            return startsWith(body, SIGNATURES.JPEG);

        case "image/png":
            return startsWith(body, SIGNATURES.PNG);

        case "image/webp":
            return isWebP(body);

        case "image/gif":
            return (
                startsWith(body, SIGNATURES.GIF87A) ||
                startsWith(body, SIGNATURES.GIF89A)
            );

        case "application/pdf":
            return startsWith(body, SIGNATURES.PDF);

        case "text/plain":
        case "text/csv":
            return isUtf8Text(body);

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return inspectOfficeArchive(body, "word/document.xml");

        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            return inspectOfficeArchive(body, "xl/workbook.xml");

        default:
            return false;
    }
}
