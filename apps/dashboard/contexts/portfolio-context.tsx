"use client";

import {
    createContext,
    useContext,
    useMemo,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { portfolioService } from "@/services/portfolio.service";

import type {
    Portfolio,
    CreatePortfolioRequest,
    UpdatePortfolioRequest,
} from "@/types/portfolio";

import axios from "axios";

import { useAuth } from "@/contexts/auth-context";

type PortfolioContextType = {
    portfolio: Portfolio | null;

    loading: boolean;

    getPortfolio: () => Promise<void>;

    createPortfolio: (
        data: CreatePortfolioRequest
    ) => Promise<void>;

    updatePortfolio: (
        data: UpdatePortfolioRequest
    ) => Promise<void>;
};

const PortfolioContext =
    createContext<PortfolioContextType | null>(
        null
    );

export function PortfolioProvider({
    children,
}: {
    children: ReactNode;
}) {
    const {
        authenticated,
        initializing,
    } = useAuth();

    const [portfolio, setPortfolio] =
        useState<Portfolio | null>(null);

    const [loading, setLoading] =
        useState(true);

    async function getPortfolio() {
        try {
            const response =
                await portfolioService.getPortfolio();

            setPortfolio(response.portfolio);
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 404
            ) {
                setPortfolio(null);
                return;
            }

            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function createPortfolio(
        data: CreatePortfolioRequest
    ) {
        const response =
            await portfolioService.createPortfolio(
                data
            );

        setPortfolio(response.portfolio);
    }

    async function updatePortfolio(
        data: UpdatePortfolioRequest
    ) {
        const response =
            await portfolioService.updatePortfolio(
                data
            );

        setPortfolio(response.portfolio);
    }
    
    useEffect(() => {
        async function loadPortfolio() {
            if (initializing) {
                return;
            }

            if (!authenticated) {
                setPortfolio(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            await getPortfolio();
        }

        loadPortfolio();
    }, [authenticated, initializing]);

    const value = useMemo(
        () => ({
            portfolio,

            loading,

            getPortfolio,

            createPortfolio,

            updatePortfolio,
        }),
        [portfolio, loading]
    );

    return (
        <PortfolioContext.Provider
            value={value}
        >
            {children}
        </PortfolioContext.Provider>
    );
}

export function usePortfolio() {
    const context =
        useContext(PortfolioContext);

    if (!context) {
        throw new Error(
            "usePortfolio must be used inside PortfolioProvider."
        );
    }

    return context;
}