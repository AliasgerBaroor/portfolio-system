import { ClientAccessProvider } from "@/contexts/client-access-context";

export default async function PortfolioLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{
        slug: string;
    }>;
}) {
    const { slug } = await params;

    return (
        <ClientAccessProvider slug={slug}>
            {children}
        </ClientAccessProvider>
    );
}   