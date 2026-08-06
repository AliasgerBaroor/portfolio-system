"use client";
import { Button } from "@workspace/ui/components/button"
import { Rocket } from "lucide-react"
import { useState } from "react";

function PublishButton() {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <Button
            variant="default"
            onClick={() => setIsCreating(true)}
        >
            <Rocket />
            Publish site
        </Button>
    )
}

export default PublishButton