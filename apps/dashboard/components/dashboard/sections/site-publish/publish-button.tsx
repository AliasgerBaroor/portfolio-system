"use client";
import { Button } from "@workspace/ui/components/button"
import { Rocket } from "lucide-react"
import { useState } from "react";

function PublishButton() {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <Button size="sm"
            onClick={() => setIsCreating(true)}
        >
            <Rocket width={8} height={8} />
            Publish site
        </Button>
    )
}

export default PublishButton