"use client";

import { Card } from "@workspace/ui/components/card";

import PasswordHeader from "./password-header";
import CreatePasswordForm from "./create-password-form";
import PasswordList from "./password-list";
import EmptyPasswords from "./empty-passwords";

import { useClientAccessKeys } from "@/contexts/client-access-key-context";
import { useClients } from "@/contexts/client-context";

export default function ClientPasswords() {
    const {
        clients,
        loading: clientsLoading,
    } = useClients();

    const {
        accessKeys,
        loading,
        createClientAccessKey,
        revokeClientAccessKey,
    } = useClientAccessKeys();

    async function createPassword(
        clientId: string
    ) {
        await createClientAccessKey({
            clientId,
        });
    }

    return (
        <Card className="p-6 space-y-5">

            <PasswordHeader />

            <CreatePasswordForm
                clients={clients}
                onCreate={createPassword}
                disabled={clientsLoading}
            />
            {clientsLoading ? (
                <div>
                    Loading clients...
                </div>
            ) : loading ? (
                <div>
                    Loading client passwords...
                </div>
            ) : accessKeys.length === 0 ? (
                <EmptyPasswords />
            ) : (
                            <PasswordList
                                passwords={accessKeys}
                                onRevoke={revokeClientAccessKey}
                            />
            )}

        </Card>
    );
}