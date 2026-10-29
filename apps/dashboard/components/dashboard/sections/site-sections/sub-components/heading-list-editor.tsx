"use client";

import { useState } from "react";

import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography/typography";
import { Trash2 } from "lucide-react";

interface HeadingListEditorProps {
    initialHeading?: string;
    initialItems?: string[];

    onSave: (data: {
        type: "BULLET_LIST";
        content: {
            layout: "HEADING_LIST";
            heading: string;
            items: string[];
        };
    }) => Promise<void>;

    onCancel: () => void;
}

export default function HeadingListEditor({
    initialHeading = "",
    initialItems = [""],
    onSave,
    onCancel,
}: HeadingListEditorProps) {
    const [heading, setHeading] =
        useState(initialHeading);

    const [items, setItems] =
        useState<string[]>(initialItems);

    const [saving, setSaving] = useState(false);

    function updateItem(
        index: number,
        value: string
    ) {
        setItems((current) =>
            current.map((item, itemIndex) =>
                itemIndex === index
                    ? value
                    : item
            )
        );
    }

    function addItem() {
        setItems((current) => [
            ...current,
            "",
        ]);
    }

    function removeItem(index: number) {
        setItems((current) =>
            current.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    }

    async function handleSave() {
        const cleanHeading = heading.trim();

        const cleanItems = items
            .map((item) => item.trim())
            .filter(Boolean);

        if (
            !cleanHeading ||
            cleanItems.length === 0
        ) {
            return;
        }

        try {
            setSaving(true);

            await onSave({
                type: "BULLET_LIST",
                content: {
                    layout: "HEADING_LIST",
                    heading: cleanHeading,
                    items: cleanItems,
                },
            });
        } finally {
            setSaving(false);
        }
    }

    return (
        <Card className="p-5 space-y-5">
            <Typography variant="heading-xs">
                New Content Block
            </Typography>

            {/* Heading */}

            <div className="space-y-2">
                <Typography variant="body-sm">
                    Heading
                </Typography>

                <Input
                    value={heading}
                    onChange={(event) =>
                        setHeading(
                            event.target.value
                        )
                    }
                    placeholder="Some outcomes from that work"
                />
            </div>

            {/* Items */}

            <div className="space-y-3">
                <Typography variant="body-sm">
                    List items
                </Typography>

                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2"
                    >
                        <Input
                            value={item}
                            onChange={(event) =>
                                updateItem(
                                    index,
                                    event.target.value
                                )
                            }
                            placeholder={`Item ${index + 1}`}
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                removeItem(index)
                            }
                            disabled={
                                items.length === 1
                            }
                        >
                            <Trash2 />
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                >
                    + Add item
                </Button>
            </div>

            {/* Actions */}

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
                        !items.some(
                            (item) => item.trim()
                        )
                    }
                >
                    {saving
                        ? "Saving..."
                        : "Save"}
                </Button>
            </div>
        </Card>
    );
}