"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { usePortfolio } from "@/contexts/portfolio-context";

export default function PortfolioGate({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const {
        portfolio,
        loading,
    } = usePortfolio();

    useEffect(() => {
        if (loading) return;

        if (!portfolio) {
            router.replace("/onboarding");
        }
    }, [
        loading,
        portfolio,
        router,
    ]);

    if (loading) {
        return null;
    }

    return <>{children}</>;
}