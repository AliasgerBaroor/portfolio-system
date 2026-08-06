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

import refreshClient from "./refresh";

let refreshPromise: Promise<void> | null = null;

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

        if (!refreshPromise) {
            refreshPromise = (async () => {
                const response =
                    await refreshClient.post("/auth/refresh");

                setAccessToken(
                    response.data.accessToken
                );
            })().finally(() => {
                refreshPromise = null;
            });
        }

        try {
            await refreshPromise;
        } catch {
            clearAccessToken();

            return Promise.reject(error);
        }

        const originalRequest =
            error.config as RetryRequestConfig;

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        originalRequest.headers.Authorization =
            `Bearer ${getAccessToken()}`;

        return api(originalRequest);
    }
);

export default api;