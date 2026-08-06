"use client";

import {
    useEffect,
    type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

type ProtectedRouteProps = {
    children: ReactNode;
};

export default function ProtectedRoute({
    children,
}: ProtectedRouteProps) {
    const router = useRouter();

    const {
        authenticated,
        initializing,
    } = useAuth();

    useEffect(() => {
        if (
            !initializing &&
            !authenticated
        ) {
            router.replace("/login");
        }
    }, [
        initializing,
        authenticated,
        router,
    ]);

    if (initializing) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    if (!authenticated) {
        return null;
    }

    return children;
}