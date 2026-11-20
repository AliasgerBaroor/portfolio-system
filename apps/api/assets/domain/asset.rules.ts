export type AssetCategory = "IMAGE" | "FILE";

export const ASSET_LIMITS = {
    IMAGE: 10 * 1024 * 1024,
    FILE: 25 * 1024 * 1024,
} as const;

export const ASSET_MIME_TYPES = {
    IMAGE: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    ],
    FILE: [
        "application/pdf",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
    ],
} as const;

export interface AssetValidationInput {
    category: AssetCategory;
    filename: string;
    mimeType: string;
    sizeBytes: number;
}

export interface AssetValidationResult {
    valid: boolean;
    errors: string[];
}

export function sanitizeFilename(filename: string): string {
    return filename
        .normalize("NFKC")
        .replace(/\\/g, "/")
        .split("/")
        .pop()!
        .replace(/[\u0000-\u001F\u007F]/g, "")
        .replace(/[^a-zA-Z0-9._ -]/g, "_")
        .trim()
        .replace(/^\.+/, "")
        .slice(0, 180);
}

export function validateAsset(
    input: AssetValidationInput,
): AssetValidationResult {
    const errors: string[] = [];

    const allowedMimeTypes = ASSET_MIME_TYPES[input.category];
    const maximumSize = ASSET_LIMITS[input.category];

    if (!input.filename.trim()) {
        errors.push("Filename is required.");
    } else if (!sanitizeFilename(input.filename)) {
        errors.push("Filename is invalid.");
    }

    if (!allowedMimeTypes.includes(
        input.mimeType as never,
    )) {
        errors.push(
            `Unsupported MIME type for ${input.category}.`,
        );
    }

    if (
        !Number.isSafeInteger(input.sizeBytes) ||
        input.sizeBytes <= 0
    ) {
        errors.push("File size must be a positive integer.");
    } else if (input.sizeBytes > maximumSize) {
        errors.push(
            `File exceeds the maximum ${input.category} size.`,
        );
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}