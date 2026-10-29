"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Plus } from "lucide-react";

import type { CreateClientRequest } from "@/types/client";

interface Props {
    onCreate: (
        data: CreateClientRequest
    ) => Promise<void>;

    disabled?: boolean;
}

export default function CreateClientForm({
    onCreate,
    disabled = false,
}: Props) {
    const [name, setName] =
        useState("");

    const [company, setCompany] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [creating, setCreating] =
        useState(false);

    const canCreate =
        !disabled &&
        !creating &&
        name.trim().length > 0;

    async function handleCreate() {
        if (!canCreate) {
            return;
        }

        try {
            setCreating(true);

            await onCreate({
                name: name.trim(),
                company:
                    company.trim() || undefined,
                email:
                    email.trim() || undefined,
            });

            setName("");
            setCompany("");
            setEmail("");
        } finally {
            setCreating(false);
        }
    }

    return (
        <>
        <div className="flex items-center gap-3">
            <Input
                inputSize="md"
                value={name}
                placeholder="Client name"
                onChange={(event) =>
                    setName(event.target.value)
                }
                radius="sm"
            />

            <Input
                inputSize="md"
                value={company}
                placeholder="Company"
                onChange={(event) =>
                    setCompany(event.target.value)
                }
                radius="sm"
            />

        </div>

        <div className="flex items-center gap-3">

            <Input
                inputSize="md"
                value={email}
                placeholder="Email"
                type="email"
                onChange={(event) =>
                    setEmail(event.target.value)
                }
                radius="sm"
            />

            <Button
                disabled={!canCreate}
                frameClassName="w-[120px]"
                onClick={handleCreate}
                variant="outline"
                size="sm"
            >
                <Plus className="size-4" />

                {creating
                    ? "Creating..."
                    : "Create"}
            </Button>
        </div>
        </>
    );
}