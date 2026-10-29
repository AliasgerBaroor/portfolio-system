"use client";

import { useEffect, useState } from "react";

import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography/typography";

import type { ContentBlock, Section } from "../types";
import { sectionsService } from "@/services/sections.service";

import AddBlock from "./add-block";

import HeadingDescriptionEditor from "./heading-description-editor";
import HeadingListEditor from "./heading-list-editor";

import { GripVertical } from "lucide-react";

interface SectionContentEditorProps {
    section: Section;
}

export default function SectionContentEditor({
    section,
}: SectionContentEditorProps) {
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [loading, setLoading] = useState(true);

    const [addingBlock, setAddingBlock] =
        useState(false);

    const [blockType, setBlockType] =
        useState<
            "HEADING_DESCRIPTION" | "HEADING_LIST" | null
        >(null);

    const [editingBlockId, setEditingBlockId] =
        useState<string | null>(null);

    const [draggedBlockId, setDraggedBlockId] =
        useState<string | null>(null);

    useEffect(() => {
        async function loadBlocks() {
            try {
                const response = await sectionsService.getBlocks(
                    section.id
                );

                setBlocks(response.blocks);
            } catch (error) {
                console.error(
                    "Failed to load content blocks:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        loadBlocks();
    }, [section.id]);

    function handleAddBlock() {
        setAddingBlock(true);
        setBlockType(null);
    }

    function handleSelectBlockType(
        type:
            | "HEADING_DESCRIPTION"
            | "HEADING_LIST"
    ) {
        setBlockType(type);
    }

    function cancelAddBlock() {
        setAddingBlock(false);
        setBlockType(null);
    }

    async function handleCreateBlock(data:
        | {
            type: "TEXT";
            content: {
                layout: "HEADING_DESCRIPTION";
                heading: string;
                description: string;
            };
        }
        | {
            type: "BULLET_LIST";
            content: {
                layout: "HEADING_LIST";
                heading: string;
                items: string[];
            };
        }
    ) {
        try {
            const response =
                await sectionsService.createBlock(
                    section.id,
                    data
                );

            setBlocks((prev) => [
                ...prev,
                response.block,
            ]);

            cancelAddBlock();
        } catch (error) {
            console.error(
                "Failed to create content block:",
                error
            );
        }
    }

    function startEditingBlock(blockId: string) {
        setEditingBlockId(blockId);
        setAddingBlock(false);
        setBlockType(null);
    }

    function cancelEditingBlock() {
        setEditingBlockId(null);
    }

    async function handleUpdateBlock(
        blockId: string,
        data:
            | {
                type: "TEXT";
                content: {
                    layout: "HEADING_DESCRIPTION";
                    heading: string;
                    description: string;
                };
            }
            | {
                type: "BULLET_LIST";
                content: {
                    layout: "HEADING_LIST";
                    heading: string;
                    items: string[];
                };
            }
    ) {
        try {
            const response =
                await sectionsService.updateBlock(
                    section.id,
                    blockId,
                    data
                );

            setBlocks((current) =>
                current.map((block) =>
                    block.id === blockId
                        ? response.block
                        : block
                )
            );

            setEditingBlockId(null);
        } catch (error) {
            console.error(
                "Failed to update content block:",
                error
            );
        }
    }

    async function handleDeleteBlock(
        blockId: string
    ) {
        try {
            await sectionsService.deleteBlock(
                section.id,
                blockId
            );

            setBlocks((current) =>
                current.filter(
                    (block) => block.id !== blockId
                )
            );

            if (editingBlockId === blockId) {
                setEditingBlockId(null);
            }
        } catch (error) {
            console.error(
                "Failed to delete content block:",
                error
            );
        }
    }
    
    async function handleToggleBlockVisibility(
        blockId: string,
        isVisible: boolean
    ) {
        try {
            const response =
                await sectionsService.updateBlockVisibility(
                    section.id,
                    blockId,
                    isVisible
                );

            setBlocks((current) =>
                current.map((block) =>
                    block.id === blockId
                        ? response.block
                        : block
                )
            );
        } catch (error) {
            console.error(
                "Failed to update block visibility:",
                error
            );
        }
    }

    function handleDragStart(
        blockId: string
    ) {
        setDraggedBlockId(blockId);
    }

    function handleDragOver(
        event: React.DragEvent<HTMLDivElement>
    ) {
        event.preventDefault();
    }

    async function handleDrop(
        targetBlockId: string
    ) {
        if (
            !draggedBlockId ||
            draggedBlockId === targetBlockId
        ) {
            setDraggedBlockId(null);
            return;
        }

        const currentIndex = blocks.findIndex(
            (block) => block.id === draggedBlockId
        );

        const targetIndex = blocks.findIndex(
            (block) => block.id === targetBlockId
        );

        if (
            currentIndex === -1 ||
            targetIndex === -1
        ) {
            setDraggedBlockId(null);
            return;
        }

        const reorderedBlocks = [...blocks];

        const [draggedBlock] =
            reorderedBlocks.splice(currentIndex, 1);

        if (!draggedBlock) {
            setDraggedBlockId(null);
            return;
        }

        reorderedBlocks.splice(
            targetIndex,
            0,
            draggedBlock
        );

        setBlocks(reorderedBlocks);

        setDraggedBlockId(null);

        try {
            await sectionsService.reorderBlocks(
                section.id,
                reorderedBlocks.map(
                    (block) => block.id
                )
            );
        } catch (error) {
            console.error(
                "Failed to reorder content blocks:",
                error
            );

            // Restore the actual server order
            const response =
                await sectionsService.getBlocks(
                    section.id
                );

            setBlocks(response.blocks);
        }
    }
    return (
        <Card className="rounded-xl p-6 space-y-5">
            {/* Section header */}
            <div>
                <Typography variant="heading-xs">
                    {section.title}
                </Typography>

                <Typography
                    variant="body-sm"
                    className="text-secondary-foreground"
                >
                    Edit the content inside this section.
                </Typography>
            </div>

            {loading && (
                <div className="py-8 text-center">
                    <Typography variant="body-sm">
                        Loading content...
                    </Typography>
                </div>
            )}

            {!loading && blocks.length === 0 && (
                <div className="rounded-lg border p-6 text-center">
                    <Typography variant="body-sm">
                        No content blocks yet.
                    </Typography>
                </div>
            )}

            {!loading && blocks.length > 0 && (
                <div className="space-y-3">
                    {blocks.map((block) => {
                        const content = block.content as {
                            layout?: string;
                            heading?: string;
                            description?: string;
                            items?: string[];
                        };

                        if (editingBlockId === block.id) {
                            if (
                                block.type === "TEXT" &&
                                content.layout === "HEADING_DESCRIPTION"
                            ) {
                                return (
                                    <HeadingDescriptionEditor
                                        key={block.id}
                                        initialHeading={
                                            content.heading ?? ""
                                        }
                                        initialDescription={
                                            content.description ?? ""
                                        }
                                        onSave={(data) =>
                                            handleUpdateBlock(
                                                block.id,
                                                data
                                            )
                                        }
                                        onCancel={cancelEditingBlock}
                                    />
                                );
                            }

                            if (
                                block.type === "BULLET_LIST" &&
                                content.layout === "HEADING_LIST"
                            ) {
                                return (
                                    <HeadingListEditor
                                        key={block.id}
                                        initialHeading={
                                            content.heading ?? ""
                                        }
                                        initialItems={
                                            content.items ?? [""]
                                        }
                                        onSave={(data) =>
                                            handleUpdateBlock(
                                                block.id,
                                                data
                                            )
                                        }
                                        onCancel={cancelEditingBlock}
                                    />
                                );
                            }
                        }

                        return (
                            <Card
                                key={block.id}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(block.id)}
                                className={`p-4 space-y-3 ${draggedBlockId === block.id
                                        ? "opacity-50"
                                        : ""
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            draggable
                                            onDragStart={() =>
                                                handleDragStart(block.id)
                                            }
                                            onDragEnd={() =>
                                                setDraggedBlockId(null)
                                            }
                                            className="cursor-grab"
                                        >
                                            <GripVertical
                                                className="size-4 text-secondary-foreground"
                                            />
                                        </div>

                                        <Typography variant="body-sm">
                                            {block.type === "TEXT"
                                                ? "Heading + Description"
                                                : "Heading + List"}
                                        </Typography>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                startEditingBlock(
                                                    block.id
                                                )
                                            }
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleToggleBlockVisibility(
                                                    block.id,
                                                    !block.isVisible
                                                )
                                            }
                                        >
                                            {block.isVisible
                                                ? "Hide"
                                                : "Show"}
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteBlock(
                                                    block.id
                                                )
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                {content.heading && (
                                    <Typography variant="heading-xs">
                                        {content.heading}
                                    </Typography>
                                )}

                                {content.description && (
                                    <Typography
                                        variant="body-sm"
                                        className="text-secondary-foreground"
                                    >
                                        {content.description}
                                    </Typography>
                                )}

                                {content.items && (
                                    <div className="space-y-1">
                                        {content.items.map(
                                            (item, index) => (
                                                <Typography
                                                    key={index}
                                                    variant="body-sm"
                                                    className="text-secondary-foreground"
                                                >
                                                    — {item}
                                                </Typography>
                                            )
                                        )}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}

            {!addingBlock && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddBlock}
                >
                    + Add Block
                </Button>
            )}

            {addingBlock && !blockType && (
                <AddBlock
                    onSelect={handleSelectBlockType}
                    onCancel={cancelAddBlock}
                />
            )}

            {addingBlock &&
                blockType === "HEADING_DESCRIPTION" && (
                    <HeadingDescriptionEditor
                        onSave={handleCreateBlock}
                        onCancel={cancelAddBlock}
                    />
                )}

            {addingBlock &&
                blockType === "HEADING_LIST" && (
                    <HeadingListEditor
                        onSave={handleCreateBlock}
                        onCancel={cancelAddBlock}
                    />
                )}
        </Card>
    );
}