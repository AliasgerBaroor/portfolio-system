"use client"
import Header from "@/components/dashboard/header"
import SiteName from "@/components/dashboard/sections/site-name";
import SitePublish from "@/components/dashboard/sections/site-publish/site-publish";
import SiteSections from "@/components/dashboard/sections/site-sections/site-sections";
import ClientPasswords from "@/components/dashboard/sections/site-visibility/client-passwords";
import SiteVisibility from "@/components/dashboard/sections/site-visibility/site-visibility";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visibility, setVisibility] = useState<
    "PUBLIC" | "PASSWORD"
  >("PUBLIC");

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex flex-col gap-8">
          <Header />
          <SiteName />
          <SiteSections />
          <SiteVisibility
            value={visibility}
            onChange={setVisibility}
          />

          {visibility === "PASSWORD" && (
            <ClientPasswords />
          )}

          <SitePublish />
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}