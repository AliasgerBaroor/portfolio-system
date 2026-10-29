"use client";

import { useClientAccess } from "@/contexts/client-access-context";
import { Button } from "@workspace/ui/components/button";
import { LogOutIcon } from "lucide-react";

export function FloatingLogout() {
    const {
        authenticated,
        logout,
    } = useClientAccess();

    if (!authenticated) {
        return null;
    }

    async function handleLogout() {
        await logout();
    }

    return (
        <Button
        size="sm"
            frameClassName="
                fixed
                right-8
                top-11
                z-50
                cursor-pointer
            "
            variant="outline"
            onClick={handleLogout}
            >

            <LogOutIcon className="shrink-0" />
        </Button>
    );
}