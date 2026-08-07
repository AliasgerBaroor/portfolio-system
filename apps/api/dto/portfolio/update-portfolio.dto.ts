import { Visibility } from "@prisma/client";

export type UpdatePortfolioDto = {
    title?: string;

    visibility?: Visibility;
};