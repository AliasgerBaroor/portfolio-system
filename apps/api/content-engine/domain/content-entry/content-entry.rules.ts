
import { ContentFieldType } from "@prisma/client";

export type ContentFieldDefinition = {
    id: string;
    parentId: string | null;
    key: string;
    type: ContentFieldType;
    isRequired: boolean;
    isUnique: boolean;
    isArray: boolean;
    defaultValue?: unknown;
    options?: unknown;
    children: ContentFieldDefinition[];
};

export interface ContentEntryValidationResult {
    data: Record<string, unknown>;
    errors: string[];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function isValidEnumValue(
    options: unknown,
    value: unknown,
): boolean {
    if (!Array.isArray(options) || options.length === 0) {
        return false;
    }

    return options.some(
        (option) =>
            isPlainObject(option)
                ? option.value === value
                : option === value,
    );
}

function isJsonValue(
    value: unknown,
    ancestors: WeakSet<object> = new WeakSet(),
): boolean {
    if (
        value === null ||
        typeof value === 'string' ||
        typeof value === 'boolean'
    ) {
        return true;
    }

    if (typeof value === 'number') {
        return Number.isFinite(value);
    }

    if (typeof value !== 'object') {
        return false;
    }

    // Only arrays and plain objects are valid JSON containers.
    if (!Array.isArray(value)) {
        const prototype = Object.getPrototypeOf(value);

        if (prototype !== Object.prototype && prototype !== null) {
            return false;
        }
    }

    // Detect circular references in the current recursion path.
    if (ancestors.has(value)) {
        return false;
    }

    ancestors.add(value);

    const isValid = Array.isArray(value)
        ? value.every((item) => isJsonValue(item, ancestors))
        : Object.values(value).every((item) => isJsonValue(item, ancestors));

    ancestors.delete(value);

    return isValid;
}

function isValidCalendarDate(
    year: number,
    month: number,
    day: number,
): boolean {
    if (year < 1 || year > 9999 || month < 1 || month > 12) {
        return false;
    }

    const isLeapYear =
        year % 4 === 0 &&
        (year % 100 !== 0 || year % 400 === 0);

    const daysInMonth = [
        31,
        isLeapYear ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ];

    const maxDay = daysInMonth[month - 1];

    return maxDay !== undefined && day >= 1 && day <= maxDay;
}

function isValidDate(value: unknown): boolean {
    if (typeof value !== "string") return false;

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) return false;

    return isValidCalendarDate(
        Number(match[1]),
        Number(match[2]),
        Number(match[3]),
    );
}

function isValidDateTime(value: unknown): boolean {
    if (typeof value !== "string") return false;

    const match =
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(Z|([+-])(\d{2}):(\d{2}))$/.exec(
            value,
        );

    if (!match) return false;

    const [, year, month, day, hour, minute, second, timezone, , offsetHour, offsetMinute] = match;

    if (
        !isValidCalendarDate(
            Number(year),
            Number(month),
            Number(day),
        )
    ) {
        return false;
    }

    if (
        Number(hour) > 23 ||
        Number(minute) > 59 ||
        Number(second) > 59
    ) {
        return false;
    }

    if (timezone !== "Z") {
        const offsetHours = Number(offsetHour);
        const offsetMinutes = Number(offsetMinute);

        if (
            offsetHours > 14 ||
            offsetMinutes > 59 ||
            (offsetHours === 14 && offsetMinutes !== 0)
        ) {
            return false;
        }
    }

    return true;
}

function isValidScalar(
    field: ContentFieldDefinition,
    value: unknown,
): boolean {
    const { type } = field;
    switch (type) {
        case ContentFieldType.TEXT:
        case ContentFieldType.RICH_TEXT:
        case ContentFieldType.MARKDOWN:
        case ContentFieldType.EMAIL:
        case ContentFieldType.URL:
        case ContentFieldType.PHONE:
            return typeof value === "string";

        case ContentFieldType.NUMBER:
            return typeof value === "number" && Number.isFinite(value);

        case ContentFieldType.BOOLEAN:
            return typeof value === "boolean";

        case ContentFieldType.DATE:
            return isValidDate(value);

        case ContentFieldType.DATETIME:
            return isValidDateTime(value);

        case ContentFieldType.JSON:
            return isJsonValue(value);
        case ContentFieldType.IMAGE:
        case ContentFieldType.FILE:
        case ContentFieldType.RELATION:
            return true;

        case ContentFieldType.ENUM:
            return isValidEnumValue(field.options, value);

        case ContentFieldType.OBJECT:
        case ContentFieldType.ARRAY:
            return false;
    }
}

function validateFields(
    fields: ContentFieldDefinition[],
    input: Record<string, unknown>,
    path: string,
    errors: string[],
): Record<string, unknown> {
    const output: Record<string, unknown> = {};

    const allowedKeys = new Set(fields.map((field) => field.key));

    for (const key of Object.keys(input)) {
        if (!allowedKeys.has(key)) {
            errors.push(`${path}${key} is not a defined field.`);
        }
    }

    for (const field of fields) {
        const fieldPath = `${path}${field.key}`;
        const exists = Object.prototype.hasOwnProperty.call(
            input,
            field.key,
        );

        let value = exists ? input[field.key] : field.defaultValue;

        if (value === undefined) {
            if (field.isRequired) {
                errors.push(`${fieldPath} is required.`);
            }

            continue;
        }

        if (value === null && field.type !== ContentFieldType.JSON) {
            if (field.isRequired) {
                errors.push(`${fieldPath} cannot be null.`);
            } else {
                output[field.key] = null;
            }

            continue;
        }

        if (field.type === ContentFieldType.OBJECT) {
            if (!isPlainObject(value)) {
                errors.push(`${fieldPath} must be an object.`);
                continue;
            }

            output[field.key] = validateFields(
                field.children,
                value,
                `${fieldPath}.`,
                errors,
            );

            continue;
        }

        if (field.type === ContentFieldType.ARRAY) {
            if (!Array.isArray(value)) {
                errors.push(`${fieldPath} must be an array.`);
                continue;
            }

            output[field.key] = value.map((item, index) => {
                if (!isPlainObject(item)) {
                    errors.push(
                        `${fieldPath}[${index}] must be an object.`,
                    );
                    return item;
                }

                return validateFields(
                    field.children,
                    item,
                    `${fieldPath}[${index}].`,
                    errors,
                );
            });

            continue;
        }

        if (field.isArray) {
            if (!Array.isArray(value)) {
                errors.push(`${fieldPath} must be an array.`);
                continue;
            }

            const invalidIndex = value.findIndex(
                (item) => !isValidScalar(field, item),
            );

            if (invalidIndex !== -1) {
                errors.push(
                    `${fieldPath}[${invalidIndex}] has an invalid value.`,
                );
                continue;
            }

            output[field.key] = value;
            continue;
        }

        if (!isValidScalar(field, value)) {
            errors.push(`${fieldPath} has an invalid value.`);
            continue;
        }

        output[field.key] = value;
    }

    return output;
}

export function validateContentEntryData(
    fields: ContentFieldDefinition[],
    input: Record<string, unknown>,
): ContentEntryValidationResult {
    const errors: string[] = [];

    validateFieldConfiguration(fields, "", errors);

    if (errors.length > 0) {
        return { data: {}, errors };
    }

    const data = validateFields(fields, input, "", errors);

    return { data, errors };
}

function validateFieldConfiguration(
    fields: ContentFieldDefinition[],
    path: string,
    errors: string[],
): void {
    for (const field of fields) {
        const fieldPath = `${path}${field.key}`;

        if (field.type === ContentFieldType.ENUM) {
            const options = field.options;

            const validOptions =
                Array.isArray(options) &&
                options.length > 0 &&
                options.every((option) => {
                    if (isPlainObject(option)) {
                        return (
                            typeof option.value === "string" ||
                            typeof option.value === "number"
                        );
                    }

                    return (
                        typeof option === "string" ||
                        typeof option === "number"
                    );
                });

            if (!validOptions) {
                errors.push(
                    `${fieldPath} has an invalid ENUM configuration: options must be a non-empty array of strings, numbers, or objects with string or number values.`,
                );
            }
        }

        validateFieldConfiguration(
            field.children,
            `${fieldPath}.`,
            errors,
        );
    }
}