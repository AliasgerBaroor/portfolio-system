"use client";

import { Card } from "@workspace/ui/components/card";

import PasswordHeader from "./password-header";
import CreatePasswordForm from "./create-password-form";
import PasswordList from "./password-list";
import EmptyPasswords from "./empty-passwords";

import { useClientAccessKeys } from "@/contexts/client-access-key-context";

export default function ClientPasswords() {
    const {
        accessKeys,
        loading,
        createClientAccessKey,
    } = useClientAccessKeys();

    async function createPassword(
        clientName: string
    ) {
        await createClientAccessKey({
            name: clientName,
        });
    }

    return (
        <Card className="p-6 space-y-5">

            <PasswordHeader />

            <CreatePasswordForm
                onCreate={createPassword}
            />

            {loading ? (
                <div>
                    Loading client passwords...
                </div>
            ) : accessKeys.length === 0 ? (
                <EmptyPasswords />
            ) : (
                <PasswordList
                    passwords={accessKeys}
                />
            )}

        </Card>
    );
}