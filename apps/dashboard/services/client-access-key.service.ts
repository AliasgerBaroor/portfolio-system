import api from "@/lib/api";

import type {
    CreateClientAccessKeyRequest,
    CreateClientAccessKeyResponse,
    GetClientAccessKeysResponse,
} from "@/types/client-access-key";

class ClientAccessKeyService {
    async getClientAccessKeys() {
        const response =
            await api.get<GetClientAccessKeysResponse>(
                "/client-access"
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
}

export const clientAccessKeyService =
    new ClientAccessKeyService();