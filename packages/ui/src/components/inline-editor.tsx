"use client"

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

function Root({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

function Header({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

function Content({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-3", className)}>
      {children}
    </div>
  );
}

function Footer({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 flex justify-end gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export const InlineEditor = Object.assign(Root, {
  Header,
  Content,
  Footer,
});