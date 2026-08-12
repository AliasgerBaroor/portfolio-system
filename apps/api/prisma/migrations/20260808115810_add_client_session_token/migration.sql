/*
  Warnings:

  - A unique constraint covering the columns `[sessionTokenHash]` on the table `ClientAccessSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionTokenHash` to the `ClientAccessSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientAccessSession" ADD COLUMN     "sessionTokenHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccessSession_sessionTokenHash_key" ON "ClientAccessSession"("sessionTokenHash");
