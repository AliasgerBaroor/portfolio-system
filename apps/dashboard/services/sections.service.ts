import type {
    CreateSectionRequest,
    CreateSectionResponse,
    GetSectionsResponse,
    GetSectionBlocksResponse,
} from "@/components/dashboard/sections/site-sections/types";

import api from "@/lib/api";

class SectionsService {
    async getSections() {
        const response = await api.get<GetSectionsResponse>(
            "/portfolio/sections"
        );

        return response.data;
    }

    async createSection(data: CreateSectionRequest) {
        const response = await api.post<CreateSectionResponse>(
            "/portfolio/sections",
            data
        );

        return response.data;
    }

    async getBlocks(sectionId: string) {
        const response = await api.get<GetSectionBlocksResponse>(
            `/portfolio/sections/${sectionId}/blocks`
        );

        return response.data;
    }

    async createBlock(
        sectionId: string,
        data:
            | {
                type: "TEXT";
                content: {
                    layout: "HEADING_DESCRIPTION";
                    heading: string;
                    description: string;
                };
            }
            | {
                type: "BULLET_LIST";
                content: {
                    layout: "HEADING_LIST";
                    heading: string;
                    items: string[];
                };
            }
    ) {
        const response = await api.post(
            `/portfolio/sections/${sectionId}/blocks`,
            data
        );

        return response.data;
    }

    async updateBlock(
        sectionId: string,
        blockId: string,
        data:
            | {
                type: "TEXT";
                content: {
                    layout: "HEADING_DESCRIPTION";
                    heading: string;
                    description: string;
                };
            }
            | {
                type: "BULLET_LIST";
                content: {
                    layout: "HEADING_LIST";
                    heading: string;
                    items: string[];
                };
            }
    ) {
        const response = await api.patch(
            `/portfolio/sections/${sectionId}/blocks/${blockId}`,
            data
        );

        return response.data;
    }

    async deleteBlock(
        sectionId: string,
        blockId: string
    ) {
        const response = await api.delete(
            `/portfolio/sections/${sectionId}/blocks/${blockId}`
        );

        return response.data;
    }

    async updateBlockVisibility(
        sectionId: string,
        blockId: string,
        isVisible: boolean
    ) {
        const response = await api.patch(
            `/portfolio/sections/${sectionId}/blocks/${blockId}/visibility`,
            {
                isVisible,
            }
        );

        return response.data;
    }

    async reorderBlocks(
        sectionId: string,
        blockIds: string[]
    ) {
        const response = await api.patch(
            `/portfolio/sections/${sectionId}/blocks/reorder`,
            {
                blockIds,
            }
        );

        return response.data;
    }
}

export const sectionsService = new SectionsService();