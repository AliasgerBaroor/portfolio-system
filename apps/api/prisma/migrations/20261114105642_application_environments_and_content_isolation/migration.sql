/*
  Warnings:

  - A unique constraint covering the columns `[applicationId,slug]` on the table `ApplicationEnvironment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[environmentId,modelId,externalId]` on the table `ContentEntry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[environmentId,modelId,slug]` on the table `ContentEntry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[environmentId,modelId,id]` on the table `ContentEntry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[environmentId,modelId,fieldId,entryId]` on the table `ContentEntryUniqueValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[environmentId,modelId,fieldId,valueHash]` on the table `ContentEntryUniqueValue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ApplicationEnvironment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `environmentId` to the `ContentEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `environmentId` to the `ContentEntryRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `environmentId` to the `ContentEntryUniqueValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "EnvironmentStatus" ADD VALUE 'ARCHIVED';

-- AlterEnum
ALTER TYPE "EnvironmentType" ADD VALUE 'CUSTOM';

-- DropForeignKey
ALTER TABLE "ContentEntryRelation" DROP CONSTRAINT "ContentEntryRelation_sourceModelId_sourceEntryId_fkey";

-- DropForeignKey
ALTER TABLE "ContentEntryRelation" DROP CONSTRAINT "ContentEntryRelation_targetModelId_targetEntryId_fkey";

-- DropForeignKey
ALTER TABLE "ContentEntryUniqueValue" DROP CONSTRAINT "ContentEntryUniqueValue_modelId_entryId_fkey";

-- DropIndex
DROP INDEX "ApplicationEnvironment_applicationId_type_key";

-- DropIndex
DROP INDEX "ContentEntry_modelId_externalId_key";

-- DropIndex
DROP INDEX "ContentEntry_modelId_slug_key";

-- DropIndex
DROP INDEX "ContentEntry_modelId_status_idx";

-- DropIndex
DROP INDEX "ContentEntry_modelId_updatedAt_idx";

-- DropIndex
DROP INDEX "ContentEntry_modelId_visibility_status_idx";

-- DropIndex
DROP INDEX "ContentEntryUniqueValue_entryId_idx";

-- DropIndex
DROP INDEX "ContentEntryUniqueValue_modelId_fieldId_entryId_key";

-- DropIndex
DROP INDEX "ContentEntryUniqueValue_modelId_fieldId_valueHash_key";

-- AlterTable
ALTER TABLE "ApplicationEnvironment" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ContentEntry" ADD COLUMN     "environmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ContentEntryRelation" ADD COLUMN     "environmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ContentEntryUniqueValue" ADD COLUMN     "environmentId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ApplicationEnvironment_applicationId_type_idx" ON "ApplicationEnvironment"("applicationId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationEnvironment_applicationId_slug_key" ON "ApplicationEnvironment"("applicationId", "slug");

-- CreateIndex
CREATE INDEX "ContentEntry_environmentId_modelId_status_idx" ON "ContentEntry"("environmentId", "modelId", "status");

-- CreateIndex
CREATE INDEX "ContentEntry_environmentId_modelId_updatedAt_idx" ON "ContentEntry"("environmentId", "modelId", "updatedAt");

-- CreateIndex
CREATE INDEX "ContentEntry_environmentId_modelId_visibility_status_idx" ON "ContentEntry"("environmentId", "modelId", "visibility", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntry_environmentId_modelId_externalId_key" ON "ContentEntry"("environmentId", "modelId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntry_environmentId_modelId_slug_key" ON "ContentEntry"("environmentId", "modelId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntry_environmentId_modelId_id_key" ON "ContentEntry"("environmentId", "modelId", "id");

-- CreateIndex
CREATE INDEX "ContentEntryRelation_environmentId_sourceEntryId_idx" ON "ContentEntryRelation"("environmentId", "sourceEntryId");

-- CreateIndex
CREATE INDEX "ContentEntryRelation_environmentId_targetEntryId_idx" ON "ContentEntryRelation"("environmentId", "targetEntryId");

-- CreateIndex
CREATE INDEX "ContentEntryUniqueValue_environmentId_entryId_idx" ON "ContentEntryUniqueValue"("environmentId", "entryId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntryUniqueValue_environmentId_modelId_fieldId_entry_key" ON "ContentEntryUniqueValue"("environmentId", "modelId", "fieldId", "entryId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntryUniqueValue_environmentId_modelId_fieldId_value_key" ON "ContentEntryUniqueValue"("environmentId", "modelId", "fieldId", "valueHash");

-- AddForeignKey
ALTER TABLE "ContentEntry" ADD CONSTRAINT "ContentEntry_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "ApplicationEnvironment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntryRelation" ADD CONSTRAINT "ContentEntryRelation_environmentId_sourceModelId_sourceEnt_fkey" FOREIGN KEY ("environmentId", "sourceModelId", "sourceEntryId") REFERENCES "ContentEntry"("environmentId", "modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntryRelation" ADD CONSTRAINT "ContentEntryRelation_environmentId_targetModelId_targetEnt_fkey" FOREIGN KEY ("environmentId", "targetModelId", "targetEntryId") REFERENCES "ContentEntry"("environmentId", "modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntryUniqueValue" ADD CONSTRAINT "ContentEntryUniqueValue_environmentId_modelId_entryId_fkey" FOREIGN KEY ("environmentId", "modelId", "entryId") REFERENCES "ContentEntry"("environmentId", "modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;
