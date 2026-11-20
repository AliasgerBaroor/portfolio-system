
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PassThrough } from "node:stream";
import { ZipFile } from "yazl";

import { validateAssetContent } from "./asset-content.rules";

const DOCX_MIME =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" as const;

const XLSX_MIME =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" as const;

async function createZip(
    entries: Array<{ name: string; content: string }>,
): Promise<Uint8Array> {
    const zip = new ZipFile();
    const output = new PassThrough();
    const chunks: Buffer[] = [];

    const completed = new Promise<Buffer>((resolve, reject) => {
        output.on("data", (chunk: Buffer) => chunks.push(chunk));
        output.on("end", () => resolve(Buffer.concat(chunks)));
        output.on("error", reject);
    });

    zip.outputStream.pipe(output);

    for (const entry of entries) {
        zip.addBuffer(Buffer.from(entry.content), entry.name);
    }

    zip.end();

    return new Uint8Array(await completed);
}

const contentTypes = `<?xml version="1.0"?><Types></Types>`;

describe("Asset content validation", () => {
    it("accepts JPEG signature", async () => {
        const body = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]);

        assert.equal(
            await validateAssetContent({
                category: "IMAGE",
                mimeType: "image/jpeg",
                body,
            }),
            true,
        );
    });

    it("accepts PNG signature", async () => {
        const body = Uint8Array.from([
            0x89, 0x50, 0x4e, 0x47,
            0x0d, 0x0a, 0x1a, 0x0a,
        ]);

        assert.equal(
            await validateAssetContent({
                category: "IMAGE",
                mimeType: "image/png",
                body,
            }),
            true,
        );
    });

    it("rejects spoofed image MIME types", async () => {
        const body = new TextEncoder().encode("This is not an image");

        assert.equal(
            await validateAssetContent({
                category: "IMAGE",
                mimeType: "image/png",
                body,
            }),
            false,
        );
    });

    it("rejects an image MIME type in FILE category", async () => {
        assert.equal(
            await validateAssetContent({
                category: "FILE",
                mimeType: "image/png",
                body: Uint8Array.from([
                    0x89, 0x50, 0x4e, 0x47,
                    0x0d, 0x0a, 0x1a, 0x0a,
                ]),
            }),
            false,
        );
    });

    it("accepts PDF signature", async () => {
        const body = new TextEncoder().encode("%PDF-1.7");

        assert.equal(
            await validateAssetContent({
                category: "FILE",
                mimeType: "application/pdf",
                body,
            }),
            true,
        );
    });

    it("rejects invalid UTF-8 text", async () => {
        assert.equal(
            await validateAssetContent({
                category: "FILE",
                mimeType: "text/plain",
                body: Uint8Array.from([0xc3, 0x28]),
            }),
            false,
        );
    });

    it("rejects empty content", async () => {
        assert.equal(
            await validateAssetContent({
                category: "IMAGE",
                mimeType: "image/png",
                body: new Uint8Array(),
            }),
            false,
        );
    });

    it("accepts a valid DOCX archive", async () => {
        const body = await createZip([
            { name: "[Content_Types].xml", content: contentTypes },
            { name: "word/document.xml", content: "<document/>" },
        ]);

        assert.equal(
            await validateAssetContent({
                category: "FILE",
                mimeType: DOCX_MIME,
                body,
            }),
            true,
        );
    });

    it("accepts a valid XLSX archive", async () => {
        const body = await createZip([
            { name: "[Content_Types].xml", content: contentTypes },
            { name: "xl/workbook.xml", content: "<workbook/>" },
        ]);

        assert.equal(
            await validateAssetContent({
                category: "FILE",
                mimeType: XLSX_MIME,
                body,
            }),
            true,
        );
    });

    it("rejects malformed ZIP data declared as DOCX", async () => {
        assert.equal(
            await validateAssetContent({
                category: "FILE",
                mimeType: DOCX_MIME,
                body: new TextEncoder().encode("not a zip archive"),
            }),
            false,
        );
    });

    it("rejects DOCX archives missing the document XML", async () => {
        const body = await createZip([
            { name: "[Content_Types].xml", content: contentTypes },
            { name: "word/styles.xml", content: "<styles/>" },
        ]);

        assert.equal(
            await validateAssetContent({
                category: "FILE",
                mimeType: DOCX_MIME,
                body,
            }),
            false,
        );
    });

    it("rejects XLSX archives missing the workbook XML", async () => {
        const body = await createZip([
            { name: "[Content_Types].xml", content: contentTypes },
            { name: "xl/worksheets/sheet1.xml", content: "<sheet/>" },
        ]);

        assert.equal(
            await validateAssetContent({
                category: "FILE",
                mimeType: XLSX_MIME,
                body,
            }),
            false,
        );
    });

    it("rejects DOCX MIME type containing an XLSX archive", async () => {
        const body = await createZip([
            { name: "[Content_Types].xml", content: contentTypes },
            { name: "xl/workbook.xml", content: "<workbook/>" },
        ]);

        assert.equal(
            await validateAssetContent({
                category: "FILE",
                mimeType: DOCX_MIME,
                body,
            }),
            false,
        );
    });

    it("rejects archives with excessive compression ratios", async () => {
        const body = await createZip([
            {
                name: "[Content_Types].xml",
                content: "A".repeat(100_000),
            },
            {
                name: "word/document.xml",
                content: "<document/>",
            },
        ]);

        assert.equal(
            await validateAssetContent({
                category: "FILE",
                mimeType: DOCX_MIME,
                body,
            }),
            false,
        );
    });
});
