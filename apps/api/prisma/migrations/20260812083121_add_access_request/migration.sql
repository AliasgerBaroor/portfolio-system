-- CreateEnum
CREATE TYPE "AccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ClientAccessRequest" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "clientId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "message" TEXT,
    "status" "AccessRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientAccessRequest_portfolioId_idx" ON "ClientAccessRequest"("portfolioId");

-- CreateIndex
CREATE INDEX "ClientAccessRequest_clientId_idx" ON "ClientAccessRequest"("clientId");

-- CreateIndex
CREATE INDEX "ClientAccessRequest_status_idx" ON "ClientAccessRequest"("status");

-- CreateIndex
CREATE INDEX "ClientAccessRequest_createdAt_idx" ON "ClientAccessRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "ClientAccessRequest" ADD CONSTRAINT "ClientAccessRequest_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAccessRequest" ADD CONSTRAINT "ClientAccessRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
