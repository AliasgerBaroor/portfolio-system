"use client";

import { useClientAccess } from "@/contexts/client-access-context";
import ClientLogin from "./client-login";

interface Props {
    children: React.ReactNode;
}

export default function ClientAccessGate({
    children,
}: Props) {
    const {
        authenticated,
        loading,
    } = useClientAccess();

    if (loading) {
        return null;
    }

    if (!authenticated) {
        return <ClientLogin />;
    }

    return <>{children}</>;
}