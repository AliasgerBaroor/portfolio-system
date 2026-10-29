import type {
    CreateBlockRequest,
    CreateBlockResponse,
    DeleteBlockResponse,
    GetBlocksResponse,
    UpdateBlockRequest,
    UpdateBlockResponse,
} from "@/components/dashboard/CMS-layout/blocks/types";

import api from "@/lib/api";

class BlocksService {
    async getBlocks(sectionId: string) {
        const response =
            await api.get<GetBlocksResponse>(
                `/portfolio/cms/sections/${sectionId}/blocks`
            );

        return response.data;
    }

    async createBlock(
        sectionId: string,
        data: CreateBlockRequest
    ) {
        const response =
            await api.post<CreateBlockResponse>(
                `/portfolio/cms/sections/${sectionId}/blocks`,
                data
            );

        return response.data;
    }

    async updateBlock(
        sectionId: string,
        blockId: string,
        data: UpdateBlockRequest
    ) {
        const response =
            await api.patch<UpdateBlockResponse>(
                `/portfolio/cms/sections/${sectionId}/blocks/${blockId}`,
                data
            );

        return response.data;
    }

    async deleteBlock(
        sectionId: string,
        blockId: string
    ) {
        const response =
            await api.delete<DeleteBlockResponse>(
                `/portfolio/cms/sections/${sectionId}/blocks/${blockId}`
            );

        return response.data;
    }
}

export const blocksService =
    new BlocksService();