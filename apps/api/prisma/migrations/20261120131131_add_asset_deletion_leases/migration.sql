-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "deletionLeaseExpiresAt" TIMESTAMP(3),
ADD COLUMN     "deletionLeaseToken" TEXT;
