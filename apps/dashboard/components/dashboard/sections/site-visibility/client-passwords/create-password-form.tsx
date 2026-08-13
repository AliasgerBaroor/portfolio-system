"use client";

import { Button } from "@workspace/ui/components/button";
import { KeyRound } from "lucide-react";
import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";

import type { Client } from "@/types/client";

interface Props {
    clients: Client[];
    onCreate(clientId: string): void;
    disabled?: boolean;
}

export default function CreatePasswordForm({
    clients,
    onCreate,
    disabled = false,
}: Props) {
    const [clientId, setClientId] =
        useState<string | null>(null);

    const canCreate =
        !disabled &&
        clientId !== null;

    const selectedClient =
        clients.find(
            (client) => client.id === clientId
        );
    return (
        <div className="flex items-center gap-3">
            <Select
                value={clientId}
                onValueChange={setClientId}
                disabled={disabled}
            >
                <SelectTrigger className="flex-1"
                    size="sm"
                    radius="sm"
                    >
                    <SelectValue>
                        {selectedClient?.name ?? "Select a client"}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent
                    side="bottom"
                    align="start"
                    sideOffset={6}
                    alignItemWithTrigger={false}
                >
                    {clients.map((client) => (
                        <SelectItem
                            key={client.id}
                            value={client.id}
                        >
                            {client.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                disabled={!canCreate}
                frameClassName="w-[120px]"
                onClick={() => {
                    if (!clientId) {
                        return;
                    }

                    onCreate(clientId);
                    setClientId(null);
                }}
                variant="outline"
                size="sm">
                <KeyRound className="size-4" />
                Create
            </Button>
        </div>
    );
}