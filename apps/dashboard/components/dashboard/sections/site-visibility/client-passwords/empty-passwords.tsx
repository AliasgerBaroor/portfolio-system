import { EmptyState } from "@workspace/ui/components/empty-state";

export default function EmptyPasswords() {
    return (
        <EmptyState
            title="No client passwords yet"
            description="Create a password for your first client."
        />
    );
}