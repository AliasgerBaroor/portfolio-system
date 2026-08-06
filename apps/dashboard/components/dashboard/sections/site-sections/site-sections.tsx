"use client";

import { useState } from "react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { EmptyState } from "@workspace/ui/components/empty-state";
import { Typography } from "@workspace/ui/components/typography";
import { Plus } from "lucide-react";

import { Section } from "./types";
import SectionEditor from "./sub-components/section-editor";
import SortableSectionList from "./sub-components/sortable-section-list";

export default function SiteSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  function saveSection(section: Section) {
    setSections((prev) => [...prev, section]);
    setIsCreating(false);
  }

  return (
    <Card className="rounded-xl p-6 space-y-5">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <Typography variant="heading-xs">
            Sections
          </Typography>

          <Typography
            variant="body-sm"
            className="text-muted-foreground"
          >
            Edit your portfolio sections.
          </Typography>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsCreating(true)}
        >
          <Plus />
          Add Section
        </Button>
      </div>

      {/* Empty */}

      {sections.length === 0 && !isCreating && (
        <EmptyState
          title="No sections yet"
          description="Add your first section."
        />
      )}

      {/* Existing Sections */}

      <SortableSectionList sections={sections} />

      {/* Editor */}

      {isCreating && (
        <SectionEditor
          onSave={saveSection}
          onCancel={() => setIsCreating(false)}
        />
      )}
    </Card>
  );
}