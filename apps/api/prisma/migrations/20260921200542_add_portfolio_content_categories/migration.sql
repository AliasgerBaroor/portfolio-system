/*
  Warnings:

  - You are about to drop the column `accessToken` on the `ClientAccessKey` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `PortfolioSection` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContentBlockType" AS ENUM ('TEXT', 'RICH_TEXT', 'BULLET_LIST', 'QUOTE', 'IMAGE', 'VIDEO');

-- DropIndex
DROP INDEX "ClientAccessKey_accessToken_idx";

-- DropIndex
DROP INDEX "ClientAccessKey_accessToken_key";

-- DropIndex
DROP INDEX "Project_slug_idx";

-- AlterTable
ALTER TABLE "ClientAccessKey" DROP COLUMN "accessToken";

-- AlterTable
ALTER TABLE "PortfolioSection" DROP COLUMN "settings";

-- CreateTable
CREATE TABLE "PortfolioContentBlock" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "type" "ContentBlockType" NOT NULL,
    "title" TEXT,
    "content" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioCategory" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientPortfolioCategory" (
    "clientId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ClientPortfolioCategory_pkey" PRIMARY KEY ("clientId","categoryId")
);

-- CreateTable
CREATE TABLE "ProjectPortfolioCategory" (
    "projectId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ProjectPortfolioCategory_pkey" PRIMARY KEY ("projectId","categoryId")
);

-- CreateIndex
CREATE INDEX "PortfolioContentBlock_sectionId_idx" ON "PortfolioContentBlock"("sectionId");

-- CreateIndex
CREATE INDEX "PortfolioContentBlock_sectionId_sortOrder_idx" ON "PortfolioContentBlock"("sectionId", "sortOrder");

-- CreateIndex
CREATE INDEX "PortfolioCategory_portfolioId_idx" ON "PortfolioCategory"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioCategory_portfolioId_slug_key" ON "PortfolioCategory"("portfolioId", "slug");

-- CreateIndex
CREATE INDEX "ClientPortfolioCategory_categoryId_idx" ON "ClientPortfolioCategory"("categoryId");

-- CreateIndex
CREATE INDEX "ProjectPortfolioCategory_categoryId_idx" ON "ProjectPortfolioCategory"("categoryId");

-- AddForeignKey
ALTER TABLE "PortfolioContentBlock" ADD CONSTRAINT "PortfolioContentBlock_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "PortfolioSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioCategory" ADD CONSTRAINT "PortfolioCategory_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPortfolioCategory" ADD CONSTRAINT "ClientPortfolioCategory_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPortfolioCategory" ADD CONSTRAINT "ClientPortfolioCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PortfolioCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPortfolioCategory" ADD CONSTRAINT "ProjectPortfolioCategory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPortfolioCategory" ADD CONSTRAINT "ProjectPortfolioCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PortfolioCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
