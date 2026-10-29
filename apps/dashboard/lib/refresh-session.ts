
import refreshClient from "@/lib/refresh";
import { setAccessToken } from "@/lib/token";

type RefreshResponse = {
    accessToken: string;
};

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
    if (!refreshPromise) {
        refreshPromise = refreshClient
            .post<RefreshResponse>("/auth/refresh")
            .then(({ data }) => {
                setAccessToken(data.accessToken);
                return data.accessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}