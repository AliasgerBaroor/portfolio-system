"use client";

import { Card } from "@workspace/ui/components/card";

import CreatePasswordForm from "./create-password-form";
import PasswordList from "./password-list";
import EmptyPasswords from "./empty-passwords";

import {
    useClientAccessKeys,
} from "@/contexts/client-access-key-context";

import { useClients } from "@/contexts/client-context";

import SectionHeader from "@/components/dashboard/section-header";

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

        /*
         * NEW
         */
        selectedCredentialId,
        setSelectedCredentialId,
    } =
        useClientAccessKeys();

    async function createPassword(
        clientId: string
    ) {
        const response =
            await createClientAccessKey({
                clientId,
            });

        /*
         * Select the newly created
         * credential.
         */
        setSelectedCredentialId(
            response.accessKey.id
        );
    }

    return (
        <Card className="p-6 space-y-5">

            <SectionHeader
                title="Client Passwords"
                description="Each password is tied to one client and expires after 24 hours."
            />

            <CreatePasswordForm
                clients={clients}
                onCreate={createPassword}
                disabled={
                    clientsLoading
                }
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
                    passwords={
                        accessKeys
                    }

                    /*
                     * NEW
                     */
                    selectedCredentialId={
                        selectedCredentialId
                    }

                    /*
                     * NEW
                     */
                    onSelect={
                        setSelectedCredentialId
                    }

                    onRevoke={
                        revokeClientAccessKey
                    }
                />
            )}

        </Card>
    );
}