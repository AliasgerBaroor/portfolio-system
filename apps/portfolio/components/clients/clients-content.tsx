"use client";

import { useState } from "react";

import { clients } from "@/data/clients";

import {
  CircleIcon,
  PlateIcon,
  SmileIcon,
  StarIcon,
  ClientsBgIcon,
  AboutBgIcon,
} from "@/icons";

import { Frame } from "@workspace/ui/components/frame";
import { IndustryTag } from "@workspace/ui/components/industry-tag";
import { Typography } from "@workspace/ui/components/typography/typography";
import ClientCategoryTooltip from "../tooltip/tooltip";

interface ClientsContentProps {
  selectedCategory: IndustryTag | null;
}

export function ClientsContent({
  selectedCategory,
}: ClientsContentProps) {
  const [hoveredCategory, setHoveredCategory] =
    useState<string | null>(null);

  const [hasHovered, setHasHovered] =
    useState(false);

  const [hoveredClientId, setHoveredClientId] =
    useState<string | null>(null);
    
  const [hoveredAnchor, setHoveredAnchor] =
    useState<HTMLElement | null>(null);

  /*
   * Initial state:
   *   selected category is highlighted.
   *
   * Once the user hovers any client:
   *   hovered category is highlighted.
   *
   * After leaving the client area:
   *   all clients become highlighted.
   *
   * The original selected category does NOT come back.
   */

  const activeCategory =
    hoveredCategory ??
    (hasHovered
      ? null
      : selectedCategory?.name ?? null);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">

      {/* HEADER */}
      <div
        className="
    relative
    w-full
    shrink-0
    aspect-[328/166]
    md:aspect-[1038/166]
    overflow-hidden
  "
      >

        <AboutBgIcon
          className="
        absolute
        inset-0
        h-full
        w-full
        md:hidden
    "
        />

        <ClientsBgIcon
          className="
        absolute
        inset-0
        hidden
        h-full
        w-full
        md:block
    "
        />

        <SmileIcon
          className="
                        absolute
                        right-5
                        top-3
                        z-10
                    "
        />

        <StarIcon
          className="
                        absolute
                        right-5
                        bottom-3
                        z-10
                    "
        />

        <CircleIcon
          className="
                        absolute
                        left-4
                        top-2
                        z-10
                    "
        />

        <PlateIcon
          className="
                        absolute
                        left-2
                        bottom-3
                        z-10
                    "
        />

        <Frame
          strength="medium"
          className="
                        absolute
                        left-1/2
                        top-1/2
                        z-10
                        flex
                        -translate-x-1/2
                        -translate-y-1/2
                        flex-col
                        items-center
                        whitespace-nowrap
                        bg-primary
                        p-3
                        px-4
                    "
        >
          <Typography variant="heading-md">
            Burhanuddin Baroor
          </Typography>

          <Typography variant="body-lg">
            Creative Director & Lead Designer
          </Typography>
        </Frame>
      </div>

      {/* CLIENTS */}
      <div
        className="
    min-h-0
    flex-1
    overflow-y-auto
    p-8
    pb-16
    hide-scrollbar
  "
      >
        <div
          className="
  grid
  grid-cols-2
  gap-x-6
  gap-y-10
  sm:grid-cols-3
  md:grid-cols-6
"
          onMouseLeave={() => {
            setHoveredCategory(null);
            setHoveredClientId(null);
            setHoveredAnchor(null);
          }}
        >
          {clients.map((client) => {
            const highlighted =
              activeCategory === null ||
              client.category === activeCategory;

            const isHovered =
              hoveredClientId === client.id;

            return (
              <div
                key={client.id}
                className={`
    relative
    flex
    h-16
    cursor-pointer
    items-center
    justify-center
    transition-opacity
    duration-200
    ${highlighted ? "opacity-100" : "opacity-30"}
  `}
                onMouseEnter={(event) => {
                  setHasHovered(true);
                  setHoveredCategory(client.category);
                  setHoveredClientId(client.id);
                  setHoveredAnchor(event.currentTarget);
                }}

                onClick={() => {
                  setHasHovered(true);
                  setHoveredCategory(client.category);

                  setHoveredClientId((current) =>
                    current === client.id ? null : client.id
                  );
                }}
              >
                <div className="relative flex items-center justify-center">
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="h-auto max-h-12 w-auto object-contain"
                    loading="lazy"
                    decoding="async"
                  />

                  {isHovered && hoveredAnchor && (
                    <ClientCategoryTooltip
                      category={client.category}
                      anchor={hoveredAnchor}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}