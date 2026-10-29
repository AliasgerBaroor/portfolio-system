
import type {
    CreateItemRequest,
    CreateItemResponse,
    GetItemsResponse,
    UpdateItemRequest,
    UpdateItemResponse,
    DeleteItemResponse,
} from "@/components/dashboard/CMS-layout/items/types";

import api from "@/lib/api";

class ItemsService {
    async getItems(collectionId: string) {
        const response = await api.get<GetItemsResponse>(
            `/portfolio/cms/collections/${collectionId}/items`
        );

        return response.data;
    }

    async createItem(
        collectionId: string,
        data: CreateItemRequest
    ) {
        const response = await api.post<CreateItemResponse>(
            `/portfolio/cms/collections/${collectionId}/items`,
            data
        );

        return response.data;
    }

    async updateItem(
        collectionId: string,
        itemId: string,
        data: UpdateItemRequest
    ) {
        const response = await api.patch<UpdateItemResponse>(
            `/portfolio/cms/collections/${collectionId}/items/${itemId}`,
            data
        );

        return response.data;
    }

    async deleteItem(
        collectionId: string,
        itemId: string
    ) {
        const response = await api.delete<DeleteItemResponse>(
            `/portfolio/cms/collections/${collectionId}/items/${itemId}`
        );

        return response.data;
    }
}

export const itemsService = new ItemsService();
