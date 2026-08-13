import axios from "axios";

import {
    getClientSessionToken,
    clearClientSession,
} from "./client-session";

const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token =
            getClientSessionToken();

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401
        ) {
            clearClientSession();
        }

        return Promise.reject(error);
    }
);

export default api;