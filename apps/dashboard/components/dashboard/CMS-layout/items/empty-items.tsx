import { EmptyState } from "@workspace/ui/components/empty-state";

export default function EmptyItems() {
    return (
        <EmptyState
            title="No item selected"
            description="Create an item using the + button in the Items panel
              to start adding content."
        />
    );
}