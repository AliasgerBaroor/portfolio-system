
import { ContentModelStatus } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

export class ContentModelLifecycleError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 404 | 409,
    ) {
        super(message);
        this.name = "ContentModelLifecycleError";
    }
}

type ContentModelLifecycleAction =
    | "ACTIVATE"
    | "ARCHIVE"
    | "RESTORE";

const TRANSITIONS: Record<
    ContentModelLifecycleAction,
    {
        from: ContentModelStatus;
        to: ContentModelStatus;
    }
> = {
    ACTIVATE: {
        from: ContentModelStatus.DRAFT,
        to: ContentModelStatus.ACTIVE,
    },
    ARCHIVE: {
        from: ContentModelStatus.ACTIVE,
        to: ContentModelStatus.ARCHIVED,
    },
    RESTORE: {
        from: ContentModelStatus.ARCHIVED,
        to: ContentModelStatus.DRAFT,
    },
};

export async function manageContentModelLifecycle(
    applicationId: string,
    modelId: string,
    action: ContentModelLifecycleAction,
) {
    const transition = TRANSITIONS[action];

    return prisma.$transaction(async (tx) => {
        const model = await tx.contentModel.findFirst({
            where: {
                id: modelId,
                applicationId,
                deletedAt: null,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                status: true,
            },
        });

        if (!model) {
            throw new ContentModelLifecycleError(
                "Content model not found.",
                404,
            );
        }

        if (model.status !== transition.from) {
            throw new ContentModelLifecycleError(
                `Cannot ${action.toLowerCase()} a model with status ${model.status}.`,
                409,
            );
        }

        const updated = await tx.contentModel.updateMany({
            where: {
                id: modelId,
                applicationId,
                status: transition.from,
                deletedAt: null,
            },
            data: {
                status: transition.to,
            },
        });

        if (updated.count !== 1) {
            throw new ContentModelLifecycleError(
                "Content model status changed. Please retry.",
                409,
            );
        }

        return {
            ...model,
            status: transition.to,
        };
    });
}
