"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState,
    useEffect,
    type ReactNode,
} from "react";

import { authService } from "@/services/auth.service";
import {
    setAccessToken,
    clearAccessToken,
} from "@/lib/token";

import type { User } from "@/types/auth";
import axios from "axios";

type AuthContextType = {
    user: User | null;

    authenticated: boolean;

    initializing: boolean;

    loginLoading: boolean;

    login: (
        email: string,
        password: string
    ) => Promise<void>;

    logout: () => Promise<void>;
};

const AuthContext =
    createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] =
        useState<User | null>(null);

    const [initializing, setInitializing] =
        useState(true);

    const [loginLoading, setLoginLoading] =
        useState(false);

    async function login(
        email: string,
        password: string
    ) {
        setLoginLoading(true);

        try {
            const response =
                await authService.login({
                    email,
                    password,
                });

            setAccessToken(response.accessToken);

            setUser(response.user);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message ??
                    "Login failed."
                );
            }

            throw error;
        } finally {
            setLoginLoading(false);
        }
    }

    async function logout() {
        await authService.logout();

        clearAccessToken();

        setUser(null);
    }

    async function restoreSession() {
        try {
            const refresh = await authService.refresh();

            setAccessToken(refresh.accessToken);

            const me = await authService.me();

            setUser(me.user);
        } catch {
            clearAccessToken();
            setUser(null);
        } finally {
            setInitializing(false);
        }
    }

    useEffect(() => {
        restoreSession();
    }, []);

    const value = useMemo(
        () => ({
            user,

            authenticated: user !== null,

            initializing,

            loginLoading,

            login,

            logout,
        }),
        [
            user,
            initializing,
            loginLoading,
        ]
    );

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider."
        );
    }

    return context;
}