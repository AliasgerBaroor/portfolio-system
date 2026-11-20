-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('UPLOADING', 'READY', 'FAILED', 'DELETED');

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "storageProvider" TEXT NOT NULL,
    "storageBucket" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "checksum" TEXT,
    "status" "AssetStatus" NOT NULL DEFAULT 'UPLOADING',
    "createdByUserId" TEXT,
    "createdByCredentialId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Asset_environmentId_status_idx" ON "Asset"("environmentId", "status");

-- CreateIndex
CREATE INDEX "Asset_environmentId_createdAt_idx" ON "Asset"("environmentId", "createdAt");

-- CreateIndex
CREATE INDEX "Asset_createdByUserId_idx" ON "Asset"("createdByUserId");

-- CreateIndex
CREATE INDEX "Asset_createdByCredentialId_idx" ON "Asset"("createdByCredentialId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_storageProvider_storageBucket_storageKey_key" ON "Asset"("storageProvider", "storageBucket", "storageKey");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "ApplicationEnvironment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_createdByCredentialId_fkey" FOREIGN KEY ("createdByCredentialId") REFERENCES "ApplicationCredential"("id") ON DELETE SET NULL ON UPDATE CASCADE;
