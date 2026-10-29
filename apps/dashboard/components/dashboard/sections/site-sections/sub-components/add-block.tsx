"use client";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Typography } from "@workspace/ui/components/typography/typography";

interface AddBlockProps {
    onSelect: (
        type: "HEADING_DESCRIPTION" | "HEADING_LIST"
    ) => void;
    onCancel: () => void;
}

export default function AddBlock({
    onSelect,
    onCancel,
}: AddBlockProps) {
    return (
        <Card className="p-5 space-y-4">
            <div>
                <Typography variant="heading-xs">
                    Add Content Block
                </Typography>

                <Typography
                    variant="body-sm"
                    className="text-secondary-foreground"
                >
                    Choose the type of content you want to add.
                </Typography>
            </div>

            <div className="grid gap-2">
                <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() =>
                        onSelect("HEADING_DESCRIPTION")
                    }
                >
                    Heading + Description
                </Button>

                <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() =>
                        onSelect("HEADING_LIST")
                    }
                >
                    Heading + List
                </Button>
            </div>

            <Button
                variant="ghost"
                onClick={onCancel}
            >
                Cancel
            </Button>
        </Card>
    );
}