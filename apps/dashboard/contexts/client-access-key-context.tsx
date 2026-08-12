"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { clientAccessKeyService } from "@/services/client-access-key.service";

import type {
    ClientAccessKey,
    CreateClientAccessKeyRequest,
    CreateClientAccessKeyResponse,
} from "@/types/client-access-key";

import axios from "axios";

import { useAuth } from "@/contexts/auth-context";

type ClientAccessKeyContextType = {
    accessKeys: ClientAccessKey[];

    loading: boolean;

    getClientAccessKeys: () => Promise<void>;

    createClientAccessKey: (
        data: CreateClientAccessKeyRequest
    ) => Promise<CreateClientAccessKeyResponse>;
};

const ClientAccessKeyContext =
    createContext<ClientAccessKeyContextType | null>(
        null
    );

export function ClientAccessKeyProvider({
    children,
}: {
    children: ReactNode;
}) {
    const {
        authenticated,
        initializing,
    } = useAuth();

    const [accessKeys, setAccessKeys] =
        useState<ClientAccessKey[]>([]);

    const [loading, setLoading] =
        useState(true);

    async function getClientAccessKeys() {
        try {
            const response =
                await clientAccessKeyService.getClientAccessKeys();

            setAccessKeys(
                response.accessKeys
            );
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 404
            ) {
                setAccessKeys([]);
                return;
            }

            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function createClientAccessKey(
        data: CreateClientAccessKeyRequest
    ) {
        const response =
            await clientAccessKeyService.createClientAccessKey(
                data
            );

        const accessKey = {
            ...response.accessKey,
            password: response.password,
        };

        setAccessKeys((prev) => [
            accessKey,
            ...prev,
        ]);

        return response;
    }

    useEffect(() => {
        async function loadAccessKeys() {
            if (initializing) {
                return;
            }

            if (!authenticated) {
                setAccessKeys([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            await getClientAccessKeys();
        }

        loadAccessKeys();
    }, [
        authenticated,
        initializing,
    ]);

    const value = useMemo(
        () => ({
            accessKeys,
            loading,
            getClientAccessKeys,
            createClientAccessKey,
        }),
        [accessKeys, loading]
    );

    return (
        <ClientAccessKeyContext.Provider
            value={value}
        >
            {children}
        </ClientAccessKeyContext.Provider>
    );
}

export function useClientAccessKeys() {
    const context =
        useContext(
            ClientAccessKeyContext
        );

    if (!context) {
        throw new Error(
            "useClientAccessKeys must be used inside ClientAccessKeyProvider."
        );
    }

    return context;
}