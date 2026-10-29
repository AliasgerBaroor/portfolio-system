import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PortfolioGate from "@/components/portfolio/PortfolioGate";
import ProtectedShell from "@/components/protected-shell";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <PortfolioGate>
                <ProtectedShell>
                    {children}
                </ProtectedShell>
            </PortfolioGate>
        </ProtectedRoute>
    );
}