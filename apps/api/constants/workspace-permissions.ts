export const WORKSPACE_PERMISSIONS = {
    READ: "workspace.read",
    UPDATE: "workspace.update",
    DELETE: "workspace.delete",

    MEMBERS_READ: "workspace.members.read",
    MEMBERS_INVITE: "workspace.members.invite",
    MEMBERS_UPDATE: "workspace.members.update",
    MEMBERS_REMOVE: "workspace.members.remove",

    ROLES_READ: "workspace.roles.read",
    ROLES_CREATE: "workspace.roles.create",
    ROLES_UPDATE: "workspace.roles.update",
    ROLES_DELETE: "workspace.roles.delete",

    APPLICATIONS_CREATE: "applications.create",
    APPLICATIONS_READ: "applications.read",
    APPLICATIONS_UPDATE: "applications.update",
    APPLICATIONS_DELETE: "applications.delete",
} as const;