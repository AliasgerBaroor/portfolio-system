import api from "@/lib/api";

import type {
    CreatePortfolioRequest,
    CreatePortfolioResponse,
    GetPortfolioResponse,
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
}

export const portfolioService =
    new PortfolioService();