import axios from "axios";

import {
    getAccessToken,
    setAccessToken,
    clearAccessToken,
} from "./token";

import type {
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

import { refreshAccessToken } from "./refresh-session";

type RetryRequestConfig =
    InternalAxiosRequestConfig & {
        _retry?: boolean;
    };

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        const originalRequest =
            error.config as RetryRequestConfig | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Never refresh in response to a refresh request.
        if (originalRequest.url?.includes("/auth/refresh")) {
            return Promise.reject(error);
        }

        // Avoid retrying the same request repeatedly.
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const accessToken = await refreshAccessToken();

            originalRequest.headers.Authorization =
                `Bearer ${accessToken}`;

            return api(originalRequest);
        } catch {
            clearAccessToken();
            return Promise.reject(error);
        }
    }
);

export default api;