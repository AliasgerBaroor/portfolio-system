"use client";

import SiteName from "@/components/dashboard/sections/site-name";
import SitePublish from "@/components/dashboard/sections/site-publish/site-publish";
import SiteSections from "@/components/dashboard/sections/site-sections/site-sections";
import ClientPasswords from "@/components/dashboard/sections/site-visibility/client-passwords";
import SiteVisibility from "@/components/dashboard/sections/site-visibility/site-visibility";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function DashboardPage() {
  const { portfolio } = usePortfolio();

  return (
    <>
      <SiteName />

      <SiteSections />

      <SiteVisibility />

      {portfolio?.visibility === "PASSWORD" && (
        <ClientPasswords />
      )}

      {portfolio && (
        <SitePublish
          slug={portfolio.slug}
        />
      )}
    </>
  );
}