"use client";

import { useState, useEffect } from "react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { EmptyState } from "@workspace/ui/components/empty-state";
import { Typography } from "@workspace/ui/components/typography/typography";
import { Plus } from "lucide-react";

import { Section } from "./types";
import SectionEditor from "./sub-components/section-editor";
import SortableSectionList from "./sub-components/sortable-section-list";

import { sectionsService } from "@/services/sections.service";

export default function SiteSections() {
  const [sections, setSections] =
    useState<Section[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [isCreating, setIsCreating] =
    useState(false);

  const [openSectionId, setOpenSectionId] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadSections() {
      try {
        const response =
          await sectionsService.getSections();

        setSections(response.sections);
      } catch (error) {
        console.error(
          "Failed to load sections:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadSections();
  }, []);

  function toggleSection(sectionId: string) {
    setOpenSectionId((current) =>
      current === sectionId ? null : sectionId
    );
  }
  
  async function saveSection(data: {
    type: Section["type"];
    title: string;
    slug: string;
  }) {
    try {
      const response =
        await sectionsService.createSection(data);

      setSections((prev) => [
        ...prev,
        response.section,
      ]);

      setIsCreating(false);
    } catch (error) {
      console.error(
        "Failed to create section:",
        error
      );
    }
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
            className="text-secondary-foreground"
          >
            Edit your portfolio sections.
          </Typography>
        </div>

        <Button
        size="sm"
          variant="outline"
          onClick={() => setIsCreating(true)}
        >
          <Plus />
          Add Section
        </Button>
      </div>

          {!loading &&
            sections.length === 0 &&
            !isCreating && (
              <EmptyState
                title="No sections yet"
                description="Add your first section."
              />
            )}

          {loading && (
            <div className="py-10 text-center">
              <Typography variant="body-sm">
                Loading sections...
              </Typography>
            </div>
          )}

            <SortableSectionList
              sections={sections}
              openSectionId={openSectionId}
              onToggle={toggleSection}
            />

          {isCreating && (
            <SectionEditor
              onSave={saveSection}
              onCancel={() => setIsCreating(false)}
            />
          )}
    </Card>
  );
}