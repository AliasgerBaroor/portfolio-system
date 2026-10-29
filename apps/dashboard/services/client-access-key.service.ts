import api from "@/lib/api";

import type {
    CreateClientAccessKeyRequest,
    CreateClientAccessKeyResponse,
    GetClientAccessKeysResponse,
} from "@/types/client-access-key";

class ClientAccessKeyService {

    async getClientAccessKeys(portfolioId: string) {
        const response =
            await api.get<GetClientAccessKeysResponse>(
                "/client-access",
                {
                    params: { portfolioId },
                },
            );

        return response.data;
    }

    async createClientAccessKey(
        data: CreateClientAccessKeyRequest
    ) {
        const response =
            await api.post<CreateClientAccessKeyResponse>(
                "/client-access",
                data
            );

        return response.data;
    }

    async revokeClientAccessKey(
        accessKeyId: string
    ) {
        const response =
            await api.delete<{
                success: boolean;
                id: string;
            }>(
                `/client-access/${accessKeyId}`
            );

        return response.data;
    }
}

export const clientAccessKeyService =
    new ClientAccessKeyService();