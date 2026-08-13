"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { clientService } from "@/services/client.service";

import type {
    Client,
    CreateClientRequest,
} from "@/types/client";

import axios from "axios";

import { useAuth } from "@/contexts/auth-context";

type ClientContextType = {
    clients: Client[];

    loading: boolean;

    getClients: () => Promise<void>;

    createClient: (
        data: CreateClientRequest
    ) => Promise<void>;
};

const ClientContext =
    createContext<ClientContextType | null>(
        null
    );

export function ClientProvider({
    children,
}: {
    children: ReactNode;
}) {
    const {
        authenticated,
        initializing,
    } = useAuth();

    const [clients, setClients] =
        useState<Client[]>([]);

    const [loading, setLoading] =
        useState(true);

    async function getClients() {
        try {
            const response =
                await clientService.getClients();

            setClients(response.clients);
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 404
            ) {
                setClients([]);
                return;
            }

            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function createClient(
        data: CreateClientRequest
    ) {
        const response =
            await clientService.createClient(data);

        setClients((prev) => [
            response.client,
            ...prev,
        ]);
    }

    useEffect(() => {
        async function loadClients() {
            if (initializing) {
                return;
            }

            if (!authenticated) {
                setClients([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            await getClients();
        }

        loadClients();
    }, [
        authenticated,
        initializing,
    ]);

    const value = useMemo(
        () => ({
            clients,
            loading,
            getClients,
            createClient,
        }),
        [clients, loading]
    );

    return (
        <ClientContext.Provider
            value={value}
        >
            {children}
        </ClientContext.Provider>
    );
}

export function useClients() {
    const context =
        useContext(ClientContext);

    if (!context) {
        throw new Error(
            "useClients must be used inside ClientProvider."
        );
    }

    console.log(
        "client context",
        context.clients
    );

    return context;
}