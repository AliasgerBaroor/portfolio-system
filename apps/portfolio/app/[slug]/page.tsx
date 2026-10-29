"use client";

import { useClientAccess } from "@/contexts/client-access-context";
import DashboardLayout from "@/components/full-portfolio/full-portfolio";

export default function PublicPortfolioPage() {
    const {
        publicPortfolio,
        portfolio,
        authenticated,
        loading,
    } = useClientAccess();

    if (loading) {
        return (
            <main className="min-h-screen p-10">
                Loading...
            </main>
        );
    }

    if (!publicPortfolio) {
        return (
            <main className="min-h-screen p-10">
                Portfolio not found.
            </main>
        );
    }

    /*
     * PUBLIC
     *
     * No password is required.
     */
    if (publicPortfolio.visibility === "PUBLIC") {
        return <DashboardLayout />;
    }

    /*
     * PASSWORD + AUTHENTICATED
     *
     * Full sensitive portfolio.
     */
    if (
        publicPortfolio.visibility === "PASSWORD" &&
        authenticated &&
        portfolio
    ) {
        return <DashboardLayout />;
    }

    /*
     * PASSWORD + NOT AUTHENTICATED
     *
     * Show ONLY the landing/basic information.
     */
    return (
        <main className="min-h-screen p-10">
            <h1 className="text-4xl font-bold">
                {publicPortfolio.title}
            </h1>

            <p className="mt-2">
                {publicPortfolio.slug}
            </p>

            <p className="mt-4">
                Published:{" "}
                {publicPortfolio.isPublished
                    ? "Yes"
                    : "No"}
            </p>

            <button
                type="button"
                onClick={() => {
                    window.location.href =
                        `/${publicPortfolio.slug}/access/${publicPortfolio.defaultAccessKeyId}`;
                }}
                className="mt-8 rounded-lg border px-5 py-3"
            >
                View Full Portfolio
            </button>
        </main>
    );
}