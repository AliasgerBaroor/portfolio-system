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

    /*
     * IMPORTANT:
     *
     * Do NOT show ClientLogin automatically here.
     *
     * The public portfolio must be visible
     * even when the client is not authenticated.
     */

    return <>{children}</>;
}