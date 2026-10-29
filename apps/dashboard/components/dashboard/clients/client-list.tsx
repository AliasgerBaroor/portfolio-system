import type { Client } from "@/types/client";
import ClientRow from "./client-row";

interface Props {
    clients: Client[];

    onRemove: (
        clientId: string
    ) => Promise<void>;
}

export default function ClientList({
    clients,
    onRemove,
}: Props) {
    return (
        <div className="space-y-2">
            {clients.map((client) => (
                <ClientRow
                    key={client.id}
                    client={client}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}