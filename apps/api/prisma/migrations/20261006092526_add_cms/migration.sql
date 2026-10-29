-- CreateTable
CREATE TABLE "CmsCollection" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsItem" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "data" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CmsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsSection" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsBlock" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "content" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CmsCollection_portfolioId_idx" ON "CmsCollection"("portfolioId");

-- CreateIndex
CREATE INDEX "CmsCollection_portfolioId_sortOrder_idx" ON "CmsCollection"("portfolioId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CmsCollection_portfolioId_slug_key" ON "CmsCollection"("portfolioId", "slug");

-- CreateIndex
CREATE INDEX "CmsItem_collectionId_idx" ON "CmsItem"("collectionId");

-- CreateIndex
CREATE INDEX "CmsItem_collectionId_sortOrder_idx" ON "CmsItem"("collectionId", "sortOrder");

-- CreateIndex
CREATE INDEX "CmsItem_collectionId_isPublished_idx" ON "CmsItem"("collectionId", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "CmsItem_collectionId_slug_key" ON "CmsItem"("collectionId", "slug");

-- CreateIndex
CREATE INDEX "CmsSection_itemId_idx" ON "CmsSection"("itemId");

-- CreateIndex
CREATE INDEX "CmsSection_itemId_sortOrder_idx" ON "CmsSection"("itemId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CmsSection_itemId_slug_key" ON "CmsSection"("itemId", "slug");

-- CreateIndex
CREATE INDEX "CmsBlock_sectionId_idx" ON "CmsBlock"("sectionId");

-- CreateIndex
CREATE INDEX "CmsBlock_sectionId_sortOrder_idx" ON "CmsBlock"("sectionId", "sortOrder");

-- AddForeignKey
ALTER TABLE "CmsCollection" ADD CONSTRAINT "CmsCollection_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsItem" ADD CONSTRAINT "CmsItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "CmsCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsSection" ADD CONSTRAINT "CmsSection_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CmsItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsBlock" ADD CONSTRAINT "CmsBlock_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CmsSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
