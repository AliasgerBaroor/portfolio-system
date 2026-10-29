/*
  Warnings:

  - A unique constraint covering the columns `[credentialId]` on the table `ClientAccessKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `credentialId` to the `ClientAccessKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientAccessKey" ADD COLUMN     "credentialId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccessKey_credentialId_key" ON "ClientAccessKey"("credentialId");
