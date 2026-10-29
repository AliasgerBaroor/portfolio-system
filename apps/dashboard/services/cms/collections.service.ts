import type {
    CreateCollectionRequest,
    CreateCollectionResponse,
    GetCollectionsResponse,
    UpdateCollectionRequest,
    UpdateCollectionResponse,
    DeleteCollectionResponse,
} from "@/components/dashboard/CMS-layout/collections/types";

import api from "@/lib/api";

class CollectionsService {
    async getCollections() {
        const response =
            await api.get<GetCollectionsResponse>(
                "/portfolio/cms/collections"
            );

        return response.data;
    }

    async createCollection(
        data: CreateCollectionRequest
    ) {
        const response =
            await api.post<CreateCollectionResponse>(
                "/portfolio/cms/collections",
                data
            );

        return response.data;
    }

    async updateCollection(
        collectionId: string,
        data: UpdateCollectionRequest
    ) {
        const response =
            await api.patch<UpdateCollectionResponse>(
                `/portfolio/cms/collections/${collectionId}`,
                data
            );

        return response.data;
    }

    async deleteCollection(
        collectionId: string
    ) {
        const response =
            await api.delete<DeleteCollectionResponse>(
                `/portfolio/cms/collections/${collectionId}`
            );

        return response.data;
    }
}

export const collectionsService =
    new CollectionsService();