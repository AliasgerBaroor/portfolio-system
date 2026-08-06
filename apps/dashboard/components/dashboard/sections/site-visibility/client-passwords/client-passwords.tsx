"use client";

import { Card } from "@workspace/ui/components/card";
import { useState } from "react";

import PasswordHeader from "./password-header";
import CreatePasswordForm from "./create-password-form";
import PasswordList from "./password-list";
import EmptyPasswords from "./empty-passwords";

import { ClientPassword } from "./types";

export default function ClientPasswords() {
    const [passwords, setPasswords] = useState<ClientPassword[]>([]);

    function createPassword(clientName: string) {
        const newPassword: ClientPassword = {
            id: crypto.randomUUID(),
            clientName,
            password: "A9X2-KP1M",
            expiresAt: new Date(),
        };

        setPasswords((prev) => [
            newPassword,
            ...prev,
        ]);
    }

    return (
        <Card className="p-6 space-y-5">

            <PasswordHeader />

            <CreatePasswordForm
                onCreate={createPassword}
            />

            {passwords.length === 0 ? (
                <EmptyPasswords />
            ) : (
                <PasswordList
                    passwords={passwords}
                />
            )}

        </Card>
    );
}