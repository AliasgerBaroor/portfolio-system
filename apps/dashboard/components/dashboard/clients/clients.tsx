"use client";

import { Card } from "@workspace/ui/components/card";

import { useClients } from "@/contexts/client-context";

import CreateClientForm from "./create-client";
import ClientList from "./client-list";
import EmptyClients from "./empty-clients";
import SectionHeader from "../section-header";

export default function ClientsSection() {
    const {
        clients,
        loading,
        createClient,
        removeClient,
    } = useClients();

    return (
        <Card className="space-y-5 p-6">

            <SectionHeader
                title="Clients"
                description="Manage the clients who can access your portfolio."
            />

            <CreateClientForm
                onCreate={createClient}
                disabled={loading}
            />

            {loading ? (
                <div>
                    Loading clients...
                </div>
            ) : clients.length === 0 ? (
                <EmptyClients />
            ) : (
                        <ClientList
                            clients={clients}
                            onRemove={removeClient}
                        />
            )}

        </Card>
    );
}