
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ContentFieldType } from "@prisma/client";

import {
    validateContentEntryData,
    type ContentFieldDefinition,
} from "./content-entry.rules";

const enumField: ContentFieldDefinition = {
    id: "status-field",
    parentId: null,
    key: "status",
    type: ContentFieldType.ENUM,
    isRequired: true,
    isUnique: false,
    isArray: false,
    options: ["DRAFT", "PUBLISHED", "ARCHIVED"],
    children: [],
};

describe("Content Entry ENUM validation", () => {
    it("accepts a configured ENUM value", () => {
        const result = validateContentEntryData(
            [enumField],
            { status: "PUBLISHED" },
        );

        assert.deepEqual(result.errors, []);
        assert.equal(result.data.status, "PUBLISHED");
    });

    it("rejects an unconfigured ENUM value", () => {
        const result = validateContentEntryData(
            [enumField],
            { status: "INVALID" },
        );

        assert.ok(result.errors.length > 0);
    });

    it("accepts configured object-based options", () => {
        const field = {
            ...enumField,
            options: [
                { label: "Draft", value: "DRAFT" },
                { label: "Published", value: "PUBLISHED" },
            ],
        };

        const result = validateContentEntryData(
            [field],
            { status: "PUBLISHED" },
        );

        assert.deepEqual(result.errors, []);
    });

    it("rejects missing ENUM options", () => {
        const field = { ...enumField, options: undefined };

        const result = validateContentEntryData(
            [field],
            { status: "PUBLISHED" },
        );

        assert.ok(result.errors.some((error) =>
            error.includes("invalid ENUM configuration"),
        ));
    });

    it("rejects empty ENUM options", () => {
        const field = { ...enumField, options: [] };

        const result = validateContentEntryData(
            [field],
            { status: "PUBLISHED" },
        );

        assert.ok(result.errors.some((error) =>
            error.includes("invalid ENUM configuration"),
        ));
    });
});


it("accepts an array containing configured ENUM values", () => {
    const field = {
        ...enumField,
        isArray: true,
    };

    const result = validateContentEntryData(
        [field],
        { status: ["DRAFT", "PUBLISHED"] },
    );

    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.data.status, ["DRAFT", "PUBLISHED"]);
});

it("rejects an array containing an invalid ENUM value", () => {
    const field = {
        ...enumField,
        isArray: true,
    };

    const result = validateContentEntryData(
        [field],
        { status: ["DRAFT", "INVALID"] },
    );

    assert.ok(result.errors.some((error) =>
        error.includes("status[1]"),
    ));
});

it("rejects non-array input for an ENUM array field", () => {
    const field = {
        ...enumField,
        isArray: true,
    };

    const result = validateContentEntryData(
        [field],
        { status: "DRAFT" },
    );

    assert.ok(result.errors.some((error) =>
        error.includes("must be an array"),
    ));

    it("rejects ENUM options without a value property", () => {
        const field = {
            ...enumField,
            options: [{ label: "Draft" }],
        };

        const result = validateContentEntryData(
            [field],
            { status: "DRAFT" },
        );

        assert.ok(result.errors.some((error) =>
            error.includes("invalid ENUM configuration"),
        ));
    });

    it("rejects ENUM options with unsupported value types", () => {
        const field = {
            ...enumField,
            options: [{ label: "Draft", value: null }],
        };

        const result = validateContentEntryData(
            [field],
            { status: "DRAFT" },
        );

        assert.ok(result.errors.some((error) =>
            error.includes("invalid ENUM configuration"),
        ));
    });
});

const jsonField: ContentFieldDefinition = {
    id: "json-field",
    parentId: null,
    key: "metadata",
    type: ContentFieldType.JSON,
    isRequired: true,
    isUnique: false,
    isArray: false,
    options: undefined,
    children: [],
};

describe("Content Entry JSON validation", () => {
    it("accepts a nested JSON object", () => {
        const value = {
            author: {
                name: "Aliasger",
                verified: true,
            },
            tags: ["typescript", "backend"],
            views: 120,
        };

        const result = validateContentEntryData(
            [jsonField],
            { metadata: value },
        );

        assert.deepEqual(result.errors, []);
        assert.deepEqual(result.data.metadata, value);
    });

    it("accepts JSON arrays and primitive values", () => {
        for (const value of [
            "hello",
            42,
            true,
            null,
            ["one", 2, false, null],
        ]) {
            const result = validateContentEntryData(
                [jsonField],
                { metadata: value },
            );

            assert.deepEqual(result.errors, []);
        }
    });

    it("rejects non-finite numbers", () => {
        for (const value of [NaN, Infinity, -Infinity]) {
            const result = validateContentEntryData(
                [jsonField],
                { metadata: value },
            );

            assert.ok(result.errors.length > 0);
        }
    });

    it("rejects undefined values inside objects", () => {
        const result = validateContentEntryData(
            [jsonField],
            {
                metadata: {
                    name: "Test",
                    optional: undefined,
                },
            },
        );

        assert.ok(result.errors.length > 0);
    });

    it("rejects functions and bigint values", () => {
        for (const value of [
            () => "test",
            BigInt(123),
        ]) {
            const result = validateContentEntryData(
                [jsonField],
                { metadata: value },
            );

            assert.ok(result.errors.length > 0);
        }
    });

    it("rejects non-plain objects", () => {
        const result = validateContentEntryData(
            [jsonField],
            { metadata: new Date() },
        );

        assert.ok(result.errors.length > 0);
    });

    it("rejects circular references", () => {
        const circular: Record<string, unknown> = {};
        circular.self = circular;

        const result = validateContentEntryData(
            [jsonField],
            { metadata: circular },
        );

        assert.ok(result.errors.length > 0);
    });
});
