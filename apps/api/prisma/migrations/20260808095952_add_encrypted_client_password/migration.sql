/*
  Warnings:

  - Added the required column `encryptedPassword` to the `ClientAccessKey` table without a default value. This is not possible if the table is not empty.
  - Made the column `expiresAt` on table `ClientAccessKey` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ClientAccessKey" ADD COLUMN     "encryptedPassword" TEXT NOT NULL,
ALTER COLUMN "expiresAt" SET NOT NULL;
