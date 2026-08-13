import api from "@/lib/api";

import {
    getClientDeviceId,
    setClientSession,
    clearClientSession,
} from "@/lib/client-session";

import type {
    ClientAccessLoginResponse,
    ClientPortfolioResponse,
} from "@/types/client-access";

class ClientAccessService {
    async login(
        slug: string,
        password: string
    ) {
        const fingerprint =
            getClientDeviceId();

        const response =
            await api.post<ClientAccessLoginResponse>(
                `/client-access/${slug}/access`,
                {
                    password,
                    fingerprint,
                }
            );

        setClientSession(
            response.data.sessionToken,
            response.data.expiresAt
        );

        return response.data;
    }

    async getPortfolio(
        slug: string
    ) {
        const response =
            await api.get<ClientPortfolioResponse>(
                `/portfolio/${slug}`
            );

        return response.data;
    }

    logout() {
        clearClientSession();
    }
}

export const clientAccessService =
    new ClientAccessService();