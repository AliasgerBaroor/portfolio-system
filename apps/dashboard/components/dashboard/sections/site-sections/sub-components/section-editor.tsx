import { useState } from "react";

import { InlineEditor } from "@workspace/ui/components/inline-editor";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography/typography";

import { SectionType } from "../types";
import { Save, LoaderCircle, Check } from "lucide-react";

interface SectionEditorProps {
    onSave: (data: {
        type: SectionType;
        title: string;
        slug: string;
    }) => void;
    onCancel: () => void;
}

export default function SectionEditor({
    onSave,
    onCancel,
}: SectionEditorProps) {
    const [type, setType] = useState<SectionType>("ABOUT");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");

    function handleTitleChange(value: string) {
        setTitle(value);

        setSlug(
            value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
        );
    }

    function handleSave() {
        if (!title.trim()) {
            return;
        }

        if (!slug.trim()) {
            return;
        }

        onSave({
            type,
            title: title.trim(),
            slug: slug.trim(),
        });
    }

    return (
        <InlineEditor>
            <InlineEditor.Header>
                <Typography variant="heading-xs">
                    New Section
                </Typography>
            </InlineEditor.Header>

            <InlineEditor.Content>
                <div className="space-y-4">
                    <select
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value as SectionType)
                        }
                        className="w-full rounded-md border px-3 py-2"
                    >
                        <option value="HERO">Hero</option>
                        <option value="PROJECTS">Projects</option>
                        <option value="ABOUT">About</option>
                        <option value="EXPERIENCE">Experience</option>
                        <option value="CONTACT">Contact</option>
                        <option value="CUSTOM">Custom</option>
                    </select>

                    <Input
                        inputSize="md"
                        value={title}
                        placeholder="Section title"
                        onChange={(e) =>
                            handleTitleChange(e.target.value)
                        }
                        //   onBlur={handleBlur}
                        radius="sm"
                    />
                    <Input
                        inputSize="md"
                        value={slug}
                        placeholder="Section slug"
                        onChange={(e) =>
                            setSlug(e.target.value)
                        }
                        //   onBlur={handleBlur}
                        radius="sm"
                    />

                </div>
            </InlineEditor.Content>

            <InlineEditor.Footer>


                <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
 
                <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!title.trim() || !slug.trim()}
                >
                    <Save size={14} />
                    Save
                </Button>
            </InlineEditor.Footer>
        </InlineEditor>
    );
}