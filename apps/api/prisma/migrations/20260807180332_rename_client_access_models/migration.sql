/*
  Warnings:

  - You are about to drop the `AccessKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccessKeySession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccessLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortfolioAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectAccess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccessKey" DROP CONSTRAINT "AccessKey_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "AccessKeySession" DROP CONSTRAINT "AccessKeySession_accessKeyId_fkey";

-- DropForeignKey
ALTER TABLE "AccessLog" DROP CONSTRAINT "AccessLog_accessKeyId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioAccess" DROP CONSTRAINT "PortfolioAccess_accessKeyId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioAccess" DROP CONSTRAINT "PortfolioAccess_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAccess" DROP CONSTRAINT "ProjectAccess_accessKeyId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAccess" DROP CONSTRAINT "ProjectAccess_projectId_fkey";

-- DropTable
DROP TABLE "AccessKey";

-- DropTable
DROP TABLE "AccessKeySession";

-- DropTable
DROP TABLE "AccessLog";

-- DropTable
DROP TABLE "PortfolioAccess";

-- DropTable
DROP TABLE "ProjectAccess";

-- CreateTable
CREATE TABLE "PortfolioClientAccess" (
    "accessKeyId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,

    CONSTRAINT "PortfolioClientAccess_pkey" PRIMARY KEY ("accessKeyId","portfolioId")
);

-- CreateTable
CREATE TABLE "ProjectClientAccess" (
    "accessKeyId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectClientAccess_pkey" PRIMARY KEY ("accessKeyId","projectId")
);

-- CreateTable
CREATE TABLE "ClientAccessKey" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "deviceLimit" INTEGER NOT NULL DEFAULT 1,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "ClientAccessKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAccessSession" (
    "id" TEXT NOT NULL,
    "accessKeyId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userAgent" TEXT,
    "deviceName" TEXT,

    CONSTRAINT "ClientAccessSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAccessLog" (
    "id" TEXT NOT NULL,
    "accessKeyId" TEXT NOT NULL,
    "ip" TEXT,
    "fingerprint" TEXT,
    "userAgent" TEXT,
    "success" BOOLEAN NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PortfolioClientAccess_portfolioId_idx" ON "PortfolioClientAccess"("portfolioId");

-- CreateIndex
CREATE INDEX "PortfolioClientAccess_accessKeyId_idx" ON "PortfolioClientAccess"("accessKeyId");

-- CreateIndex
CREATE INDEX "ProjectClientAccess_projectId_idx" ON "ProjectClientAccess"("projectId");

-- CreateIndex
CREATE INDEX "ProjectClientAccess_accessKeyId_idx" ON "ProjectClientAccess"("accessKeyId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccessKey_accessToken_key" ON "ClientAccessKey"("accessToken");

-- CreateIndex
CREATE INDEX "ClientAccessKey_ownerId_idx" ON "ClientAccessKey"("ownerId");

-- CreateIndex
CREATE INDEX "ClientAccessKey_accessToken_idx" ON "ClientAccessKey"("accessToken");

-- CreateIndex
CREATE INDEX "ClientAccessSession_accessKeyId_idx" ON "ClientAccessSession"("accessKeyId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccessSession_accessKeyId_fingerprint_key" ON "ClientAccessSession"("accessKeyId", "fingerprint");

-- CreateIndex
CREATE INDEX "ClientAccessLog_accessKeyId_idx" ON "ClientAccessLog"("accessKeyId");

-- CreateIndex
CREATE INDEX "ClientAccessLog_createdAt_idx" ON "ClientAccessLog"("createdAt");

-- AddForeignKey
ALTER TABLE "PortfolioClientAccess" ADD CONSTRAINT "PortfolioClientAccess_accessKeyId_fkey" FOREIGN KEY ("accessKeyId") REFERENCES "ClientAccessKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioClientAccess" ADD CONSTRAINT "PortfolioClientAccess_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectClientAccess" ADD CONSTRAINT "ProjectClientAccess_accessKeyId_fkey" FOREIGN KEY ("accessKeyId") REFERENCES "ClientAccessKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectClientAccess" ADD CONSTRAINT "ProjectClientAccess_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAccessKey" ADD CONSTRAINT "ClientAccessKey_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAccessSession" ADD CONSTRAINT "ClientAccessSession_accessKeyId_fkey" FOREIGN KEY ("accessKeyId") REFERENCES "ClientAccessKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAccessLog" ADD CONSTRAINT "ClientAccessLog_accessKeyId_fkey" FOREIGN KEY ("accessKeyId") REFERENCES "ClientAccessKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
