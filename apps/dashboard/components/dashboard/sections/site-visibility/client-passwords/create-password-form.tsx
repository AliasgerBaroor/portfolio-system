"use client";

import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { KeyRound } from "lucide-react";
import { useState } from "react";

interface Props {
    onCreate(clientName: string): void;
}

export default function CreatePasswordForm({
    onCreate,
}: Props) {
    const [clientName, setClientName] = useState("");

    return (
        <div className="flex gap-3 items-center">
            <Input
                className="flex-1"
                placeholder="e.g. Logifex"
                value={clientName}
                onChange={(e) =>
                    setClientName(e.target.value)
                }
            />

            <Button
                size="sm"

                onClick={() => {
                    onCreate(clientName);
                    setClientName("");
                }}
                variant="secondary"
            >
                <KeyRound className="size-4" />
                Create
            </Button>
        </div>
    );
}