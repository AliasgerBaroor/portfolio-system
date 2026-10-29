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
import { usePortfolio } from "./portfolio-context";

type ClientAccessKeyContextType = {
    accessKeys: ClientAccessKey[];

    loading: boolean;

    selectedCredentialId: string | null;

    setSelectedCredentialId: (
        credentialId: string | null
    ) => void;

    getClientAccessKeys: (
        portfolioId: string,
    ) => Promise<void>;

    createClientAccessKey: (
        data: CreateClientAccessKeyRequest
    ) => Promise<CreateClientAccessKeyResponse>;

    revokeClientAccessKey: (
        accessKeyId: string
    ) => Promise<void>;
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

    const {
        portfolio,
        loading: portfolioLoading,
    } = usePortfolio();

    const portfolioId = portfolio?.id ?? null;

    const [accessKeys, setAccessKeys] =
        useState<ClientAccessKey[]>([]);

    const [loading, setLoading] =
        useState(true);

    /*
     * Currently selected credential.
     */
    const [
        selectedCredentialId,
        setSelectedCredentialId,
    ] =
        useState<string | null>(null);

    async function getClientAccessKeys(
        id: string,
    ) {
        try {
            const response =
                await clientAccessKeyService.getClientAccessKeys(id);

            setAccessKeys(response.accessKeys);
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

        /*
         * Newest credential goes first.
         */
        setAccessKeys((prev) => [
            accessKey,
            ...prev,
        ]);

        /*
         * Automatically select the newly
         * created credential.
         */
        setSelectedCredentialId(
            accessKey.id
        );

        return response;
    }

    async function revokeClientAccessKey(
        accessKeyId: string
    ) {
        await clientAccessKeyService.revokeClientAccessKey(
            accessKeyId
        );

        setAccessKeys((prev) =>
            prev.filter(
                (accessKey) =>
                    accessKey.id !==
                    accessKeyId
            )
        );

        /*
         * If the deleted/revoked credential
         * was selected, clear selection.
         */
        setSelectedCredentialId(
            (current) =>
                current === accessKeyId
                    ? null
                    : current
        );
    }

    /*
     * Load access keys.
     */

    useEffect(() => {
        let cancelled = false;

        async function loadAccessKeys() {
            if (initializing || portfolioLoading) {
                return;
            }

            if (!authenticated || !portfolioId) {
                setAccessKeys([]);
                setSelectedCredentialId(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                await getClientAccessKeys(portfolioId);
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        "Failed to load client access keys:",
                        error,
                    );
                    setLoading(false);
                }
            }
        }

        void loadAccessKeys();

        return () => {
            cancelled = true;
        };
    }, [
        authenticated,
        initializing,
        portfolioLoading,
        portfolioId,
    ]);
    
    /*
     * Automatically select the first
     * active/non-expired credential.
     *
     * Since newly-created keys are inserted
     * at index 0, this normally means the
     * latest valid credential.
     */
    useEffect(() => {
        if (
            selectedCredentialId !== null
        ) {
            const selectedKey =
                accessKeys.find(
                    (key) =>
                        key.id ===
                        selectedCredentialId
                );

            const selectedKeyStillValid =
                selectedKey &&
                selectedKey.isActive &&
                (
                    selectedKey.expiresAt ===
                    null ||
                    new Date(
                        selectedKey.expiresAt
                    ) > new Date()
                );

            if (
                selectedKeyStillValid
            ) {
                return;
            }
        }

        const latestValidKey =
            accessKeys.find(
                (key) =>
                    key.isActive &&
                    (
                        key.expiresAt ===
                        null ||
                        new Date(
                            key.expiresAt
                        ) > new Date()
                    )
            );

        setSelectedCredentialId(
            latestValidKey?.id ?? null
        );
    }, [
        accessKeys,
        selectedCredentialId,
    ]);

    const value =
        useMemo(
            () => ({
                accessKeys,
                loading,

                selectedCredentialId,
                setSelectedCredentialId,

                getClientAccessKeys,
                createClientAccessKey,
                revokeClientAccessKey,
            }),
            [
                accessKeys,
                loading,
                selectedCredentialId,
            ]
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