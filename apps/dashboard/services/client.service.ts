import api from "@/lib/api";

import type {
    CreateClientRequest,
    CreateClientResponse,
    GetClientsResponse,
} from "@/types/client";

class ClientService {
    async getClients() {
        const response =
            await api.get<GetClientsResponse>(
                "/clients"
            );

        return response.data;
    }

    async createClient(
        data: CreateClientRequest
    ) {
        const response =
            await api.post<CreateClientResponse>(
                "/clients",
                data
            );

        return response.data;
    }

    async removeClient(
        clientId: string
    ) {
        const response =
            await api.delete(
                `/clients/${clientId}`
            );

        return response.data;
    }
}

export const clientService =
    new ClientService();