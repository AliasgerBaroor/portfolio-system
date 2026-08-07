-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('HERO', 'PROJECTS', 'ABOUT', 'EXPERIENCE', 'CONTACT', 'CUSTOM');

-- CreateTable
CREATE TABLE "ProjectOverview" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "logo" TEXT,
    "category" TEXT,
    "shortDescription" TEXT,
    "collaborators" TEXT,
    "scope" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectOverview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectGalleryImage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectGalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioSection" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectOverview_projectId_key" ON "ProjectOverview"("projectId");

-- CreateIndex
CREATE INDEX "ProjectGalleryImage_projectId_idx" ON "ProjectGalleryImage"("projectId");

-- CreateIndex
CREATE INDEX "ProjectGalleryImage_projectId_sortOrder_idx" ON "ProjectGalleryImage"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "PortfolioSection_portfolioId_idx" ON "PortfolioSection"("portfolioId");

-- CreateIndex
CREATE INDEX "PortfolioSection_portfolioId_sortOrder_idx" ON "PortfolioSection"("portfolioId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioSection_portfolioId_slug_key" ON "PortfolioSection"("portfolioId", "slug");

-- AddForeignKey
ALTER TABLE "ProjectOverview" ADD CONSTRAINT "ProjectOverview_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectGalleryImage" ADD CONSTRAINT "ProjectGalleryImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioSection" ADD CONSTRAINT "PortfolioSection_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
