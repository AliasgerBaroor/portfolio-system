import api from "@/lib/api";

import type {
    CreatePortfolioRequest,
    CreatePortfolioResponse,
    GetPortfolioResponse,
    Portfolio,
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

    async publishPortfolio() {
        const response =
            await api.post<{
                success: boolean;
                portfolio: Portfolio;
            }>("/portfolio/publish");

        return response.data;
    }

    async deletePortfolio() {
        const response =
            await api.delete<{
                success: boolean;
                portfolio: Portfolio;
            }>("/portfolio");

        return response.data;
    }
}

export const portfolioService =
    new PortfolioService();