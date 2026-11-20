import { Hono } from "hono";
import { Prisma } from "@prisma/client";

import { authMiddleware } from "../../middleware/auth.middleware";
import { CreateApplicationSchema } from "../../validators/application/create-application.validator";
import { createApplication } from "../../services/application/create-application.service";
import { WorkspacePermissionError } from "../../services/authorization/workspace-permission.service";
import { listWorkspaceApplications } from "../../services/application/list-workspace-applications.service";
import { UpdateApplicationSchema } from "../../validators/application/update-application.validator";

import {
    updateApplication,
    ApplicationNotFoundError,
} from "../../services/application/update-application.service";

import {
    deleteApplication,
    ApplicationDeletionNotFoundError,
} from "../../services/application/delete-application.service";

import {
    listApplicationEnvironments,
    ApplicationEnvironmentNotFoundError,
} from "../../services/application/list-application-environments.service";

import { ApplicationPermissionError } from "../../services/authorization/application-permission.service";

import { CreateApplicationEnvironmentSchema } from "../../validators/application/create-application-environment.validator";
import {
    createApplicationEnvironment,
    ApplicationEnvironmentCreationError,
} from "../../services/application/create-application-environment.service";

import { UpdateApplicationEnvironmentSchema } from "../../validators/application/update-application-environment.validator";

import {
    updateApplicationEnvironment,
    ApplicationEnvironmentUpdateError,
} from "../../services/application/update-application-environment.service";

import {
    archiveApplicationEnvironment,
    restoreApplicationEnvironment,
    ApplicationEnvironmentLifecycleError,
} from "../../services/application/manage-application-environment-lifecycle.service";

import { CreateApplicationCredentialSchema } from "../../validators/application/create-application-credential.validator";

import {
    createApplicationCredential,
    ApplicationCredentialCreationError,
} from "../../services/application/create-application-credential.service";

import {
    listApplicationCredentials,
    ApplicationCredentialListError,
} from "../../services/application/list-application-credentials.service";

import {
    revokeApplicationCredential,
    ApplicationCredentialRevocationError,
} from "../../services/application/revoke-application-credential.service";

const applications = new Hono();

applications.post("/:workspaceId/applications", authMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        const parsed = CreateApplicationSchema.safeParse(body);

        if (!parsed.success) {
            return c.json(
                {
                    success: false,
                    message: "Invalid application data.",
                    errors: parsed.error.flatten(),
                },
                400,
            );
        }

        const user = c.get("user");
        const workspaceId = c.req.param("workspaceId");

        if (!workspaceId) {
            return c.json({
                success: false,
                message: "Workspace ID is required.",
            }, 400);
        }

        const application = await createApplication(
            user.id,
            workspaceId,
            parsed.data,
        );

        return c.json(
            {
                success: true,
                application,
            },
            201,
        );
    } catch (error) {
        if (error instanceof WorkspacePermissionError) {
            return c.json(
                {
                    success: false,
                    message: error.message,
                },
                error.statusCode,
            );
        }

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return c.json(
                {
                    success: false,
                    message: "An application with this slug already exists in this workspace.",
                },
                409,
            );
        }

        console.error("Create application error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to create application.",
            },
            500,
        );
    }
});

applications.get("/:workspaceId/applications", authMiddleware, async (c) => {
    try {
        const user = c.get("user");
        const workspaceId = c.req.param("workspaceId");

        if (!workspaceId) {
            return c.json({
                success: false,
                message: "Workspace ID is required.",
            }, 400);
        }

        const applicationList = await listWorkspaceApplications(
            user.id,
            workspaceId,
        );

        return c.json({
            success: true,
            applications: applicationList,
        });
    } catch (error) {
        if (error instanceof WorkspacePermissionError) {
            return c.json(
                {
                    success: false,
                    message: error.message,
                },
                error.statusCode,
            );
        }

        console.error("List workspace applications error:", error);

        return c.json(
            {
                success: false,
                message: "Failed to retrieve applications.",
            },
            500,
        );
    }
});

applications.patch(
    "/:workspaceId/applications/:applicationId",
    authMiddleware,
    async (c) => {
        try {
            const body = await c.req.json();
            const parsed = UpdateApplicationSchema.safeParse(body);

            if (!parsed.success) {
                return c.json(
                    {
                        success: false,
                        message: "Invalid application data.",
                        errors: parsed.error.flatten(),
                    },
                    400,
                );
            }

            const user = c.get("user");
            const workspaceId = c.req.param("workspaceId");
            const applicationId = c.req.param("applicationId");

            if (!workspaceId || !applicationId) {
                return c.json(
                    {
                        success: false,
                        message: "Workspace ID and application ID are required.",
                    },
                    400,
                );
            }

            const application = await updateApplication(
                user.id,
                workspaceId,
                applicationId,
                parsed.data,
            );

            return c.json({
                success: true,
                application,
            });
        } catch (error) {
            if (error instanceof WorkspacePermissionError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    error.statusCode,
                );
            }

            if (error instanceof ApplicationNotFoundError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    404,
                );
            }

            console.error("Update application error:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to update application.",
                },
                500,
            );
        }
    },
);

applications.delete(
    "/:workspaceId/applications/:applicationId",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");
            const workspaceId = c.req.param("workspaceId");
            const applicationId = c.req.param("applicationId");

            if (!workspaceId || !applicationId) {
                return c.json(
                    {
                        success: false,
                        message: "Workspace ID and application ID are required.",
                    },
                    400,
                );
            }

            const result = await deleteApplication(
                user.id,
                workspaceId,
                applicationId,
            );

            return c.json({
                success: true,
                message: "Application archived successfully.",
                application: result,
            });
        } catch (error) {
            if (error instanceof WorkspacePermissionError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    error.statusCode,
                );
            }

            if (error instanceof ApplicationDeletionNotFoundError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    404,
                );
            }

            console.error("Delete application error:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to archive application.",
                },
                500,
            );
        }
    },
);

applications.get(
    "/:workspaceId/applications/:applicationId/environments",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");
            const workspaceId = c.req.param("workspaceId");
            const applicationId = c.req.param("applicationId");

            if (!workspaceId || !applicationId) {
                return c.json(
                    {
                        success: false,
                        message: "Workspace ID and application ID are required.",
                    },
                    400,
                );
            }

            const environments = await listApplicationEnvironments(
                user.id,
                workspaceId,
                applicationId,
            );

            return c.json({
                success: true,
                environments,
            });
        } catch (error) {
            if (error instanceof ApplicationPermissionError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    error.statusCode,
                );
            }

            if (error instanceof ApplicationEnvironmentNotFoundError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    404,
                );
            }

            console.error("List application environments error:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to retrieve application environments.",
                },
                500,
            );
        }
    },
);

applications.post(
    "/:workspaceId/applications/:applicationId/environments",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");
            const workspaceId = c.req.param("workspaceId");
            const applicationId = c.req.param("applicationId");

            if (!workspaceId || !applicationId) {
                return c.json(
                    {
                        success: false,
                        message: "Workspace ID and application ID are required.",
                    },
                    400,
                );
            }

            const body = await c.req.json();
            const parsed = CreateApplicationEnvironmentSchema.safeParse(body);

            if (!parsed.success) {
                return c.json(
                    {
                        success: false,
                        message: "Invalid environment data.",
                        errors: parsed.error.flatten(),
                    },
                    400,
                );
            }

            const environment = await createApplicationEnvironment({
                userId: user.id,
                workspaceId,
                applicationId,
                ...parsed.data,
            });

            return c.json(
                {
                    success: true,
                    environment,
                },
                201,
            );
        } catch (error) {
            if (error instanceof ApplicationEnvironmentCreationError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    error.status,
                );
            }

            if (error instanceof ApplicationPermissionError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    error.statusCode,
                );
            }

            throw error;
        }
    },
);

applications.patch(
    "/:workspaceId/applications/:applicationId/environments/:environmentId",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");
            const workspaceId = c.req.param("workspaceId");
            const applicationId = c.req.param("applicationId");
            const environmentId = c.req.param("environmentId");

            if (!workspaceId || !applicationId || !environmentId) {
                return c.json(
                    {
                        success: false,
                        message: "Workspace ID, application ID and environment ID are required.",
                    },
                    400,
                );
            }

            const body = await c.req.json();
            const parsed = UpdateApplicationEnvironmentSchema.safeParse(body);

            if (!parsed.success) {
                return c.json(
                    {
                        success: false,
                        message: "Invalid environment update data.",
                        errors: parsed.error.flatten(),
                    },
                    400,
                );
            }

            const environment = await updateApplicationEnvironment({
                userId: user.id,
                workspaceId,
                applicationId,
                environmentId,
                data: parsed.data,
            });

            return c.json({
                success: true,
                environment,
            });
        } catch (error) {
            if (error instanceof ApplicationEnvironmentUpdateError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    error.statusCode,
                );
            }

            if (error instanceof ApplicationPermissionError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    error.statusCode,
                );
            }

            console.error("Update application environment error:", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to update application environment.",
                },
                500,
            );
        }
    },
);

applications.delete(
    "/:workspaceId/applications/:applicationId/environments/:environmentId",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");
            const { workspaceId, applicationId, environmentId } = c.req.param();

            if (!workspaceId || !applicationId || !environmentId) {
                return c.json({
                    success: false,
                    message: "Workspace, application, and environment IDs are required.",
                }, 400);
            }

            const environment = await archiveApplicationEnvironment({
                userId: user.id,
                workspaceId,
                applicationId,
                environmentId,
            });

            return c.json({
                success: true,
                message: "Environment archived successfully.",
                environment,
            });
        } catch (error) {
            if (
                error instanceof ApplicationEnvironmentLifecycleError ||
                error instanceof ApplicationPermissionError
            ) {
                return c.json({
                    success: false,
                    message: error.message,
                }, error.statusCode);
            }

            console.error("Archive application environment error:", error);

            return c.json({
                success: false,
                message: "Failed to archive environment.",
            }, 500);
        }
    },
);

applications.post(
    "/:workspaceId/applications/:applicationId/environments/:environmentId/restore",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");
            const { workspaceId, applicationId, environmentId } = c.req.param();

            if (!workspaceId || !applicationId || !environmentId) {
                return c.json({
                    success: false,
                    message: "Workspace, application, and environment IDs are required.",
                }, 400);
            }

            const environment = await restoreApplicationEnvironment({
                userId: user.id,
                workspaceId,
                applicationId,
                environmentId,
            });

            return c.json({
                success: true,
                message: "Environment restored successfully.",
                environment,
            });
        } catch (error) {
            if (
                error instanceof ApplicationEnvironmentLifecycleError ||
                error instanceof ApplicationPermissionError
            ) {
                return c.json({
                    success: false,
                    message: error.message,
                }, error.statusCode);
            }

            console.error("Restore application environment error:", error);

            return c.json({
                success: false,
                message: "Failed to restore environment.",
            }, 500);
        }
    },
);


applications.post(
    "/:workspaceId/applications/:applicationId/environments/:environmentId/credentials",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");

            const {
                workspaceId,
                applicationId,
                environmentId,
            } = c.req.param();

            if (!workspaceId || !applicationId || !environmentId) {
                return c.json({
                    success: false,
                    message: "Workspace, application, and environment IDs are required.",
                }, 400);
            }

            const body = await c.req.json();

            const parsed = CreateApplicationCredentialSchema.safeParse(body);

            if (!parsed.success) {
                return c.json({
                    success: false,
                    message: "Invalid credential data.",
                    errors: parsed.error.flatten(),
                }, 400);
            }

            const result = await createApplicationCredential({
                userId: user.id,
                workspaceId,
                applicationId,
                environmentId,
                ...parsed.data,
            });

            return c.json({
                success: true,
                message: "Application credential created successfully. Copy your secret now; it will not be shown again.",
                credential: result.credential,
                secret: result.secret,
            }, 201);

        } catch (error) {
            if (error instanceof ApplicationCredentialCreationError) {
                return c.json({
                    success: false,
                    message: error.message,
                }, error.status);
            }

            if (error instanceof ApplicationPermissionError) {
                return c.json({
                    success: false,
                    message: error.message,
                }, error.statusCode);
            }
        }
    },
);


applications.get(
    "/:workspaceId/applications/:applicationId/environments/:environmentId/credentials",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");

            const {
                workspaceId,
                applicationId,
                environmentId,
            } = c.req.param();

            if (!workspaceId || !applicationId || !environmentId) {
                return c.json({
                    success: false,
                    message: "Workspace, application, and environment IDs are required.",
                }, 400);
            }

            const credentials = await listApplicationCredentials({
                userId: user.id,
                workspaceId,
                applicationId,
                environmentId,
            });

            return c.json({
                success: true,
                credentials,
            });

        } catch (error) {
            if (
                error instanceof ApplicationCredentialListError ||
                error instanceof ApplicationPermissionError
            ) {
                return c.json({
                    success: false,
                    message: error.message,
                }, error.statusCode);
            }

            console.error("List application credentials error:", error);

            return c.json({
                success: false,
                message: "Failed to retrieve application credentials.",
            }, 500);
        }
    },
);


applications.delete(
    "/:workspaceId/applications/:applicationId/environments/:environmentId/credentials/:credentialId",
    authMiddleware,
    async (c) => {
        try {
            const user = c.get("user");

            const {
                workspaceId,
                applicationId,
                environmentId,
                credentialId,
            } = c.req.param();

            if (
                !workspaceId ||
                !applicationId ||
                !environmentId ||
                !credentialId
            ) {
                return c.json({
                    success: false,
                    message: "Workspace, application, environment, and credential IDs are required.",
                }, 400);
            }

            const credential = await revokeApplicationCredential({
                userId: user.id,
                workspaceId,
                applicationId,
                environmentId,
                credentialId,
            });

            return c.json({
                success: true,
                message: "Application credential revoked successfully.",
                credential,
            });

        } catch (error) {
            if (error instanceof ApplicationCredentialRevocationError) {
                return c.json({
                    success: false,
                    message: error.message,
                }, error.statusCode);
            }

            if (error instanceof ApplicationPermissionError) {
                return c.json({
                    success: false,
                    message: error.message,
                }, error.statusCode);
            }

            console.error("Revoke application credential error:", error);

            return c.json({
                success: false,
                message: "Failed to revoke application credential.",
            }, 500);
        }
    },
);


export default applications;