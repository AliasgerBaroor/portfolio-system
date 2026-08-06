import api from "@/lib/api";

import type {
    LoginRequest,
    LoginResponse,
    MeResponse,
    ApiResponse,
} from "@/types/auth";

export async function login(
    data: LoginRequest
) {
    const response =
        await api.post<LoginResponse>(
            "/auth/login",
            data
        );

    return response.data;
}

export async function refresh() {
    const response =
        await api.post<LoginResponse>(
            "/auth/refresh"
        );

    return response.data;
}

export async function logout() {
    const response =
        await api.post<ApiResponse>(
            "/auth/logout"
        );

    return response.data;
}

export async function me() {
    const response =
        await api.get<MeResponse>(
            "/auth/me"
        );

    return response.data;
}