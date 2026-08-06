"use client";

import {
    useEffect,
    type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

type GuestRouteProps = {
    children: ReactNode;
};

export default function GuestRoute({
    children,
}: GuestRouteProps) {
    const router = useRouter();

    const {
        authenticated,
        initializing,
    } = useAuth();

    useEffect(() => {
        if (
            !initializing &&
            authenticated
        ) {
            router.replace("/");
        }
    }, [
        authenticated,
        initializing,
        router,
    ]);

    if (initializing) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    if (authenticated) {
        return null;
    }

    return children;
}