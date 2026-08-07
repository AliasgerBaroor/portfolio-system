import api from "@/lib/api";

import type {
    CreatePortfolioRequest,
    CreatePortfolioResponse,
    GetPortfolioResponse,
    UpdatePortfolioRequest,
    UpdatePortfolioResponse,
} from "@/types/portfolio";

class PortfolioService {
    async getPortfolio() {
        const response =
            await api.get<GetPortfolioResponse>(
                "/portfolio"
            );

        return response.data;
    }

    async createPortfolio(
        data: CreatePortfolioRequest
    ) {
        const response =
            await api.post<CreatePortfolioResponse>(
                "/portfolio",
                data
            );

        return response.data;
    }

    async updatePortfolio(
        data: UpdatePortfolioRequest
    ) {
        const response =
            await api.patch<UpdatePortfolioResponse>(
                "/portfolio",
                data
            );

        return response.data;
    }
}

export const portfolioService =
    new PortfolioService();