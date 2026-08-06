import { InlineEditor } from "@workspace/ui/components/inline-editor";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography";
import { Textarea } from "@workspace/ui/components/textarea";
import { Section } from "../types";
import { Trash2 } from "lucide-react";

interface SectionEditorProps {
    onSave: (section: Section) => void;
    onCancel: () => void;
}

export default function SectionEditor({
    onCancel,
}: SectionEditorProps) {
    return (
        <InlineEditor>
            <InlineEditor.Header>
                <Typography variant="heading-xs">
                    New Section
                </Typography>
            </InlineEditor.Header>

            <InlineEditor.Content>
                <div className="flex item-center gap-2">
                    <Input placeholder="Section title" />
                    <Button variant="ghost" size="icon"><Trash2 /></Button>
                </div>

                <Textarea className="border rounded-md p-2 min-h-40" placeholder="Search text..." />
            </InlineEditor.Content>

            <InlineEditor.Footer>
                <Button
                    variant="ghost"
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Button>Save</Button>
            </InlineEditor.Footer>
        </InlineEditor>
    );
}