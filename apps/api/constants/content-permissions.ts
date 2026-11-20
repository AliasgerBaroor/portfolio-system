export const CONTENT_PERMISSIONS = {
    MODEL_CREATE: "content.models.create",
    MODEL_READ: "content.models.read",
    MODEL_UPDATE: "content.models.update",
    MODEL_ARCHIVE: "content.models.archive",

    FIELD_CREATE: "content.fields.create",
    FIELD_READ: "content.fields.read",
    FIELD_UPDATE: "content.fields.update",
    FIELD_DELETE: "content.fields.delete",

    ENTRY_CREATE: "content.entries.create",
    ENTRY_READ: "content.entries.read",
    ENTRY_UPDATE: "content.entries.update",
    ENTRY_DELETE: "content.entries.delete",
    ENTRY_PUBLISH: "content.entries.publish",
} as const;