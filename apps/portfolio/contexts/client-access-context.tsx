"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import { clientAccessService } from "@/services/client-access.service";

import type {
    ClientPortfolio,
} from "@/types/client-access";

type ClientAccessContextType = {
    authenticated: boolean;
    loading: boolean;

    publicPortfolio:
    | ClientPortfolio
    | null;

    portfolio:
    | ClientPortfolio
    | null;

    sessionExpiresAt: Date | null;

    credentialId: string | null;

    login: (
        password: string,
        credentialId: string
    ) => Promise<void>;

    loadPortfolio: () => Promise<void>;

    logout: () => Promise<void>;

    handleSessionExpired: () => Promise<void>;
};

const ClientAccessContext =
    createContext<
        ClientAccessContextType | null
    >(null);

interface Props {
    children: ReactNode;
    slug: string;
}

export function ClientAccessProvider({
    children,
    slug,
}: Props) {
    const router = useRouter();

    const [authenticated, setAuthenticated] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [
        publicPortfolio,
        setPublicPortfolio,
    ] =
        useState<ClientPortfolio | null>(
            null
        );

    const [portfolio, setPortfolio] =
        useState<ClientPortfolio | null>(
            null
        );

    const [
        sessionExpiresAt,
        setSessionExpiresAt,
    ] =
        useState<Date | null>(null);

    const [
        credentialId,
        setCredentialId,
    ] =
        useState<string | null>(null);

    /*
     * Load public portfolio.
     */
    async function loadPublicPortfolio() {
        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            throw new Error(
                "NEXT_PUBLIC_API_URL is not configured."
            );
        }

        const response =
            await fetch(
                `${apiUrl}/portfolio/${slug}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

        if (!response.ok) {
            throw new Error(
                `Failed to load portfolio (${response.status}).`
            );
        }

        const data =
            await response.json();

        setPublicPortfolio(
            data.portfolio
        );
    }

    /*
     * Load protected portfolio.
     *
     * The backend validates the
     * HttpOnly client access session cookie.
     *
     * Backend response must contain:
     *
     * response.session.expiresAt
     * response.session.credentialId
     */
    async function loadPortfolio() {
        try {
            const response =
                await clientAccessService.getPortfolio(
                    slug
                );

            /*
             * Protected portfolio.
             */
            setPortfolio(
                response.portfolio
            );

            /*
             * REAL current session expiration.
             */
            setSessionExpiresAt(
                new Date(
                    response.session.expiresAt
                )
            );

            /*
             * Restore the credential ID.
             *
             * This is especially important after
             * a browser refresh because React state
             * has been destroyed.
             */
            setCredentialId(
                response.session.credentialId
            );

            setAuthenticated(true);
        } catch (error) {
            setPortfolio(null);
            setAuthenticated(false);
            setSessionExpiresAt(null);
            setCredentialId(null);

            throw error;
        }
    }

    /*
     * Login.
     *
     * ClientAccessKey
     *       ↓
     * ClientAccessSession
     *       ↓
     * HttpOnly cookie
     *       ↓
     * loadPortfolio()
     */
    async function login(
        password: string,
        credentialId: string
    ) {
        if (!credentialId) {
            throw new Error(
                "Credential ID is required."
            );
        }

        /*
         * Remember credential immediately.
         *
         * This allows the expiration redirect
         * to work immediately after login.
         */
        setCredentialId(
            credentialId
        );

        /*
         * Backend authenticates the password,
         * creates ClientAccessSession and
         * sets the HttpOnly cookie.
         */
        await clientAccessService.login(
            slug,
            password,
            credentialId
        );

        /*
         * Load protected portfolio and restore
         * session information.
         */
        await loadPortfolio();
    }

    /*
     * Manual logout.
     */
    async function logout() {
        try {
            await clientAccessService.logout();
        } finally {
            setPortfolio(null);
            setAuthenticated(false);
            setSessionExpiresAt(null);
            setCredentialId(null);
        }
    }

    /*
     * Session expiration.
     *
     * Called by FloatingClock when:
     *
     * 00:00:01
     * 00:00:00
     */
    const handleSessionExpired =
        useCallback(async () => {
            /*
             * Save this BEFORE clearing state.
             */
            const currentCredentialId =
                credentialId;

            /*
             * Immediately remove protected
             * portfolio from React state.
             */
            setPortfolio(null);
            setAuthenticated(false);
            setSessionExpiresAt(null);
            setCredentialId(null);

            /*
             * Tell backend to clear/revoke
             * the current session.
             */
            try {
                await clientAccessService.logout();
            } catch {
                /*
                 * The backend session may already
                 * have expired, which is fine.
                 */
            }

            /*
             * Your actual route is:
             *
             * /client-access/[slug]/access/[credentialId]
             *
             * Example:
             *
             * /client-access/
             * aliasger-portfolio/
             * FMXBS0R1-3H9
             */
            if (currentCredentialId) {
                router.replace(
                    `/${slug}/access/${currentCredentialId}`
                );
            }
        }, [
            credentialId,
            router,
            slug,
        ]);

    /*
     * Initial page load.
     */
    useEffect(() => {
        async function initialize() {
            try {
                /*
                 * Public portfolio.
                 */
                await loadPublicPortfolio();

                /*
                 * Try existing HttpOnly session.
                 *
                 * If cookie is valid:
                 *
                 * portfolio loads
                 * expiresAt restores
                 * credentialId restores
                 *
                 * If cookie is invalid/expired:
                 * authentication remains false.
                 */
                try {
                    await loadPortfolio();
                } catch {
                    setPortfolio(null);
                    setAuthenticated(false);
                    setSessionExpiresAt(null);
                    setCredentialId(null);
                }
            } catch (error) {
                console.error(
                    "Failed to initialize client access:",
                    error
                );

                setPublicPortfolio(null);
                setPortfolio(null);
                setAuthenticated(false);
                setSessionExpiresAt(null);
                setCredentialId(null);
            } finally {
                setLoading(false);
            }
        }

        initialize();
    }, [slug]);

    /*
     * Context value.
     */
    const value =
        useMemo<ClientAccessContextType>(
            () => ({
                authenticated,
                loading,
                publicPortfolio,
                portfolio,
                sessionExpiresAt,
                credentialId,
                login,
                loadPortfolio,
                logout,
                handleSessionExpired,
            }),
            [
                authenticated,
                loading,
                publicPortfolio,
                portfolio,
                sessionExpiresAt,
                credentialId,
                handleSessionExpired,
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