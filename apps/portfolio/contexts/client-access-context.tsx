"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { clientAccessService } from "@/services/client-access.service";

import {
    getClientSessionToken,
    clearClientSession,
} from "@/lib/client-session";

import type {
    ClientPortfolio,
} from "@/types/client-access";

type ClientAccessContextType = {
    authenticated: boolean;

    loading: boolean;

    portfolio: ClientPortfolio | null;

    login: (
        password: string
    ) => Promise<void>;

    loadPortfolio: () => Promise<void>;

    logout: () => void;
};

const ClientAccessContext =
    createContext<ClientAccessContextType | null>(
        null
    );

function getPortfolioSlug() {
    return process.env.NEXT_PUBLIC_PORTFOLIO_SLUG ?? null;
}

export function ClientAccessProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [authenticated, setAuthenticated] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [portfolio, setPortfolio] =
        useState<ClientPortfolio | null>(
            null
        );

    async function loadPortfolio() {
        const slug = getPortfolioSlug();

        if (!slug) {
            setPortfolio(null);
            setAuthenticated(false);
            return;
        }

        try {
            const response =
                await clientAccessService.getPortfolio(
                    slug
                );

            setPortfolio(
                response.portfolio
            );

            setAuthenticated(true);
        } catch (error) {
            setPortfolio(null);
            setAuthenticated(false);

            throw error;
        }
    }

    async function login(
        password: string
    ) {
        const slug = getPortfolioSlug();

        if (!slug) {
            throw new Error(
                "Portfolio slug is required."
            );
        }

        await clientAccessService.login(
            slug,
            password
        );

        await loadPortfolio();
    }

    function logout() {
        clearClientSession();

        setPortfolio(null);
        setAuthenticated(false);
    }

    useEffect(() => {
        async function initialize() {
            const token =
                getClientSessionToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                await loadPortfolio();
            } catch {
                clearClientSession();
                setPortfolio(null);
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }

        initialize();
    }, []);

    const value = useMemo(
        () => ({
            authenticated,
            loading,
            portfolio,
            login,
            loadPortfolio,
            logout,
        }),
        [
            authenticated,
            loading,
            portfolio,
        ]
    );

    return (
        <ClientAccessContext.Provider
            value={value}
        >
            {children}
        </ClientAccessContext.Provider>
    );
}

export function useClientAccess() {
    const context =
        useContext(
            ClientAccessContext
        );

    if (!context) {
        throw new Error(
            "useClientAccess must be used inside ClientAccessProvider."
        );
    }

    return context;
}