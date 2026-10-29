import api from "@/lib/api";

import {
    getClientDeviceId,
    clearClientSession,
} from "@/lib/client-session";

import type {
    ClientAccessLoginResponse,
    ClientPortfolioResponse,
} from "@/types/client-access";

class ClientAccessService {
    async login(
        slug: string,
        password: string,
        credentialId: string
    ) {
        const fingerprint =
            getClientDeviceId();

        const response =
            await api.post<ClientAccessLoginResponse>(
                `/client-access/${slug}/access`,
                {
                    password,
                    fingerprint,
                    credentialId,
                }
            );

        return response.data;
    }

    async getPortfolio(slug: string) {
        const response =
            await api.get<ClientPortfolioResponse>(
                `/portfolio/${slug}/full`
            );

        return response.data;
    }

    async logout() {
        try {
            await api.post(
                "/client-access/me/logout"
            );
        } finally {
            clearClientSession();
        }
    }
}

export const clientAccessService =
    new ClientAccessService();