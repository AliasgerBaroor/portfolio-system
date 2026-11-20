
export const ALLOWED_PERMISSIONS = new Set([
    "workspace.read",
    "workspace.update",
    "workspace.delete",

    "workspace.members.read",
    "workspace.members.invite",
    "workspace.members.update",
    "workspace.members.remove",

    "workspace.roles.read",
    "workspace.roles.create",
    "workspace.roles.update",
    "workspace.roles.delete",

    "applications.create",
    "applications.read",
    "applications.update",
    "applications.delete",

    "content.models.create",
    "content.models.read",
    "content.models.update",
    "content.models.archive",

    "content.fields.create",
    "content.fields.read",
    "content.fields.update",
    "content.fields.delete",

    "content.entries.create",
    "content.entries.read",
    "content.entries.update",
    "content.entries.delete",
    "content.entries.publish",
]);
