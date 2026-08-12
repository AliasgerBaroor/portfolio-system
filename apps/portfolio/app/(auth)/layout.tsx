export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-svh flex items-center justify-center bg-background p-6">
            <div className="w-full">
                {children}
            </div>
        </main>
    );
}