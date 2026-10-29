"use client";

import { useParams, useRouter } from "next/navigation";

import ClientLogin from "@/components/client-access/client-login";

export default function ClientAccessPage() {
    const router = useRouter();

    const params = useParams<{
        slug: string;
        accessKeyId: string;
    }>();

    console.log(
        "CLIENT ACCESS PARAMS:",
        params
    );

    return (
        <ClientLogin
            credentialId={params.accessKeyId}
            onSuccess={() => {
                router.push(`/${params.slug}`);
            }}
        />
    );
}