import api from "@/lib/api";

import type {
    LoginRequest,
    LoginResponse,
    MeResponse,
    ApiResponse,
} from "@/types/auth";

class AuthService {
    async login(data: LoginRequest) {
        const response = await api.post<LoginResponse>(
            "/auth/login",
            data
        );

        return response.data;
    }

    async refresh() {
        const response = await api.post<LoginResponse>(
            "/auth/refresh"
        );

        return response.data;
    }

    async logout() {
        const response = await api.post<ApiResponse>(
            "/auth/logout"
        );

        return response.data;
    }

    async me() {
        const response = await api.get<MeResponse>(
            "/auth/me"
        );

        return response.data;
    }
}

export const authService = new AuthService();