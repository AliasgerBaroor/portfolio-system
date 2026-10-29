import type {
    GetSectionsResponse,
    GetSectionResponse,
    CreateSectionResponse,
    UpdateSectionResponse,
    DeleteSectionResponse,
    CreateSectionInput,
    UpdateSectionInput,
} from "@/components/dashboard/CMS-layout/sections/types";

import api from "@/lib/api";

class SectionsService {
    
    async getSections(itemId: string) {
        const response =
            await api.get<GetSectionsResponse>(
                `/portfolio/cms/items/${itemId}/sections`
            );

        return response.data;
    }

    async getSection(
        itemId: string,
        sectionId: string
    ) {
        const response =
            await api.get<GetSectionResponse>(
                `/portfolio/cms/items/${itemId}/sections/${sectionId}`
            );

        return response.data;
    }

    async createSection(
        itemId: string,
        data: CreateSectionInput
    ) {
        const response =
            await api.post<CreateSectionResponse>(
                `/portfolio/cms/items/${itemId}/sections`,
                data
            );

        return response.data;
    }

    async updateSection(
        itemId: string,
        sectionId: string,
        data: UpdateSectionInput
    ) {
        const response =
            await api.patch<UpdateSectionResponse>(
                `/portfolio/cms/items/${itemId}/sections/${sectionId}`,
                data
            );

        return response.data;
    }

    async deleteSection(
        itemId: string,
        sectionId: string
    ) {
        const response =
            await api.delete<DeleteSectionResponse>(
                `/portfolio/cms/items/${itemId}/sections/${sectionId}`
            );

        return response.data;
    }
}

export const sectionsService =
    new SectionsService();