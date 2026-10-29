"use client";

import Header from "@/components/dashboard/header";

interface ProtectedShellProps {
    children: React.ReactNode;
}

export default function ProtectedShell({
    children,
}: ProtectedShellProps) {
    return (
        <main className="flex h-screen flex-col bg-background">
            <div className="flex min-h-0 flex-1 flex-col p-2">
                <Header />

                <div className="min-h-0 flex-1 pt-5">
                    {children}
                </div>
            </div>
        </main>
    );
}