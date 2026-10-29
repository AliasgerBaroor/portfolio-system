"use client";

import { useState } from "react";

import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography/typography";

interface HeadingDescriptionEditorProps {
    initialHeading?: string;
    initialDescription?: string;

    onSave: (data: {
        type: "TEXT";
        content: {
            layout: "HEADING_DESCRIPTION";
            heading: string;
            description: string;
        };
    }) => Promise<void>;

    onCancel: () => void;
}

export default function HeadingDescriptionEditor({
    initialHeading = "",
    initialDescription = "",
    onSave,
    onCancel,
}: HeadingDescriptionEditorProps) {
    const [heading, setHeading] =
        useState(initialHeading);

    const [description, setDescription] =
        useState(initialDescription);

    const [saving, setSaving] =
        useState(false);

    async function handleSave() {
        if (!heading.trim() || !description.trim()) {
            return;
        }

        try {
            setSaving(true);

            await onSave({
                type: "TEXT",
                content: {
                    layout: "HEADING_DESCRIPTION",
                    heading: heading.trim(),
                    description: description.trim(),
                },
            });
        } finally {
            setSaving(false);
        }
    }

    return (
        <Card className="p-5 space-y-4">
            <Typography variant="heading-xs">
                New Content Block
            </Typography>

            <div className="space-y-2">
                <Typography variant="body-sm">
                    Heading
                </Typography>

                <Input
                    value={heading}
                    onChange={(event) =>
                        setHeading(event.target.value)
                    }
                    placeholder="About Us"
                />
            </div>

            <div className="space-y-2">
                <Typography variant="body-sm">
                    Description
                </Typography>

                <Textarea
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                    placeholder="Write your description..."
                    className="min-h-32"
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    disabled={saving}
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleSave}
                    disabled={
                        saving ||
                        !heading.trim() ||
                        !description.trim()
                    }
                >
                    {saving ? "Saving..." : "Save"}
                </Button>
            </div>
        </Card>
    );
}