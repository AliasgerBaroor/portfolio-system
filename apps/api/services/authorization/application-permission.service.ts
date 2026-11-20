
import {
    ApplicationStatus,
    MembershipStatus,
    WorkspaceStatus,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";

export class ApplicationPermissionError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 403 | 404,
    ) {
        super(message);
        this.name = "ApplicationPermissionError";
    }
}

function hasPermission(
    permissions: unknown,
    requiredPermission: string,
): boolean {
    if (!Array.isArray(permissions)) {
        return false;
    }

    return permissions.some(
        (permission) =>
            typeof permission === "string" &&
            permission === requiredPermission,
    );
}

export async function requireApplicationPermission(
    userId: string,
    applicationId: string,
    requiredPermission: string,
) {
    const application = await prisma.application.findFirst({
        where: {
            id: applicationId,
            status: ApplicationStatus.ACTIVE,
            deletedAt: null,
            workspace: {
                status: WorkspaceStatus.ACTIVE,
                deletedAt: null,
            },
        },
        select: {
            id: true,
            name: true,
            workspaceId: true,
            workspace: {
                select: {
                    ownerId: true,
                    members: {
                        where: {
                            userId,
                            status: MembershipStatus.ACTIVE,
                        },
                        select: {
                            role: {
                                select: {
                                    permissions: true,
                                },
                            },
                        },
                        take: 1,
                    },
                },
            },
        },
    });

    if (!application) {
        throw new ApplicationPermissionError(
            "Application not found.",
            404,
        );
    }

    // Workspace owners have full workspace permissions.
    if (application.workspace.ownerId === userId) {
        return application;
    }

    const membership =
        application.workspace.members[0];

    if (!membership) {
        throw new ApplicationPermissionError(
            "You do not have access to this application.",
            404,
        );
    }

    if (
        !hasPermission(
            membership.role.permissions,
            requiredPermission,
        )
    ) {
        throw new ApplicationPermissionError(
            "You do not have permission to perform this action.",
            403,
        );
    }

    return application;
}
