import { EmptyState } from "@workspace/ui/components/empty-state";

export default function EmptyClient() {
    return (
        <EmptyState
            title="No client yet"
            description="Create your first client."
        />
    );
}