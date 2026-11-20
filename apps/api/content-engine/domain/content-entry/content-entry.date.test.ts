
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ContentFieldType } from "@prisma/client";

import {
    validateContentEntryData,
    type ContentFieldDefinition,
} from "./content-entry.rules";

const dateField: ContentFieldDefinition = {
    id: "date-field",
    parentId: null,
    key: "date",
    type: ContentFieldType.DATE,
    isRequired: true,
    isUnique: false,
    isArray: false,
    children: [],
};

const datetimeField: ContentFieldDefinition = {
    ...dateField,
    id: "datetime-field",
    key: "datetime",
    type: ContentFieldType.DATETIME,
};

describe("Content Entry DATE validation", () => {
    it("accepts a valid calendar date", () => {
        const result = validateContentEntryData(
            [dateField],
            { date: "2026-11-15" },
        );

        assert.deepEqual(result.errors, []);
    });

    it("accepts a valid leap day", () => {
        const result = validateContentEntryData(
            [dateField],
            { date: "2024-02-29" },
        );

        assert.deepEqual(result.errors, []);
    });

    it("rejects an impossible calendar date", () => {
        const result = validateContentEntryData(
            [dateField],
            { date: "2026-02-30" },
        );

        assert.ok(result.errors.length > 0);
    });

    it("rejects an incorrectly formatted date", () => {
        const result = validateContentEntryData(
            [dateField],
            { date: "15-11-2026" },
        );

        assert.ok(result.errors.length > 0);
    });

    it("rejects a non-leap-year February 29", () => {
        const result = validateContentEntryData(
            [dateField],
            { date: "2025-02-29" },
        );

        assert.ok(result.errors.length > 0);
    });
});

describe("Content Entry DATETIME validation", () => {
    it("accepts an ISO 8601 datetime with UTC timezone", () => {
        const result = validateContentEntryData(
            [datetimeField],
            { datetime: "2026-11-15T15:30:00Z" },
        );

        assert.deepEqual(result.errors, []);
    });

    it("accepts an ISO 8601 datetime with timezone offset", () => {
        const result = validateContentEntryData(
            [datetimeField],
            { datetime: "2026-11-15T15:30:00+05:30" },
        );

        assert.deepEqual(result.errors, []);
    });

    it("rejects datetime without timezone", () => {
        const result = validateContentEntryData(
            [datetimeField],
            { datetime: "2026-11-15T15:30:00" },
        );

        assert.ok(result.errors.length > 0);
    });

    it("rejects an impossible datetime", () => {
        const result = validateContentEntryData(
            [datetimeField],
            { datetime: "2026-02-30T15:30:00Z" },
        );

        assert.ok(result.errors.length > 0);
    });

    it("rejects an invalid time", () => {
        const result = validateContentEntryData(
            [datetimeField],
            { datetime: "2026-11-15T25:70:00Z" },
        );

        assert.ok(result.errors.length > 0);
    });
});


describe("Content Entry DATE/DATETIME edge cases", () => {
    it("rejects a date with an invalid month", () => {
        const result = validateContentEntryData(
            [dateField],
            { date: "2026-13-15" },
        );

        assert.ok(result.errors.length > 0);
    });

    it("rejects day zero", () => {
        const result = validateContentEntryData(
            [dateField],
            { date: "2026-11-00" },
        );

        assert.ok(result.errors.length > 0);
    });

    it("rejects timezone offsets beyond 14 hours", () => {
        const result = validateContentEntryData(
            [datetimeField],
            { datetime: "2026-11-15T15:30:00+14:01" },
        );

        assert.ok(result.errors.length > 0);
    });

    it("rejects invalid timezone offset minutes", () => {
        const result = validateContentEntryData(
            [datetimeField],
            { datetime: "2026-11-15T15:30:00+05:60" },
        );

        assert.ok(result.errors.length > 0);
    });

    it("accepts valid fractional seconds", () => {
        const result = validateContentEntryData(
            [datetimeField],
            { datetime: "2026-11-15T15:30:00.123456Z" },
        );

        assert.deepEqual(result.errors, []);
    });

    it("rejects fractional seconds exceeding nine digits", () => {
        const result = validateContentEntryData(
            [datetimeField],
            { datetime: "2026-11-15T15:30:00.1234567890Z" },
        );

        assert.ok(result.errors.length > 0);
    });
});
