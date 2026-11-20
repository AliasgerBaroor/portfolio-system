-- CreateEnum
CREATE TYPE "WorkspaceStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'INVITED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('WEBSITE', 'PORTFOLIO', 'WEB_APP', 'MOBILE_APP', 'INTERNAL_TOOL', 'OTHER');

-- CreateEnum
CREATE TYPE "ApplicationIntegrationMode" AS ENUM ('MANAGED', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EnvironmentType" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "EnvironmentStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "ContentModelStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContentFieldType" AS ENUM ('TEXT', 'RICH_TEXT', 'MARKDOWN', 'NUMBER', 'BOOLEAN', 'DATE', 'DATETIME', 'EMAIL', 'URL', 'PHONE', 'ENUM', 'JSON', 'OBJECT', 'ARRAY', 'IMAGE', 'FILE', 'RELATION');

-- CreateEnum
CREATE TYPE "ContentEntryStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContentVersionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "ContentVisibility" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ContentAccessMethod" AS ENUM ('OPEN', 'PASSWORD', 'APPROVED_ACCESS');

-- CreateEnum
CREATE TYPE "ContentRelationType" AS ENUM ('ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE', 'MANY_TO_MANY');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "WorkspaceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceRole" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceInvitation" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "invitedById" TEXT,
    "tokenHash" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "ApplicationType" NOT NULL,
    "integrationMode" "ApplicationIntegrationMode" NOT NULL DEFAULT 'MANAGED',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationEnvironment" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EnvironmentType" NOT NULL,
    "status" "EnvironmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationEnvironment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationCredential" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "environmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "scopes" JSONB NOT NULL,
    "createdById" TEXT,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentModelVersion" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "schema" JSONB NOT NULL,
    "createdById" TEXT,
    "changeSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentModelVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentModel" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "ContentModelStatus" NOT NULL DEFAULT 'DRAFT',
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ContentModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentField" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "type" "ContentFieldType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isUnique" BOOLEAN NOT NULL DEFAULT false,
    "isArray" BOOLEAN NOT NULL DEFAULT false,
    "defaultValue" JSONB,
    "validation" JSONB,
    "options" JSONB,
    "uiConfig" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentEntry" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "externalId" TEXT,
    "slug" TEXT,
    "status" "ContentEntryStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "ContentVisibility" NOT NULL DEFAULT 'PRIVATE',
    "accessMethod" "ContentAccessMethod" NOT NULL DEFAULT 'OPEN',
    "passwordHash" TEXT,
    "publishedAt" TIMESTAMP(3),
    "currentDraftVersionId" TEXT,
    "publishedVersionId" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ContentEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentVersion" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "schemaVersion" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "status" "ContentVersionStatus" NOT NULL,
    "changeSummary" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "ContentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentRelationDefinition" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "sourceModelId" TEXT NOT NULL,
    "targetModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "ContentRelationType" NOT NULL,
    "description" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isBidirectional" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentRelationDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentEntryRelation" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "sourceModelId" TEXT NOT NULL,
    "targetModelId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "sourceEntryId" TEXT NOT NULL,
    "targetEntryId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentEntryRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentEntryAccessGrant" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "approvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentEntryAccessGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentEntryUniqueValue" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "valueHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentEntryUniqueValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

-- CreateIndex
CREATE INDEX "Workspace_status_idx" ON "Workspace"("status");

-- CreateIndex
CREATE INDEX "Workspace_createdById_idx" ON "Workspace"("createdById");

-- CreateIndex
CREATE INDEX "WorkspaceRole_workspaceId_idx" ON "WorkspaceRole"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceRole_workspaceId_key_key" ON "WorkspaceRole"("workspaceId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceRole_workspaceId_id_key" ON "WorkspaceRole"("workspaceId", "id");

-- CreateIndex
CREATE INDEX "WorkspaceMember_userId_idx" ON "WorkspaceMember"("userId");

-- CreateIndex
CREATE INDEX "WorkspaceMember_workspaceId_status_idx" ON "WorkspaceMember"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "WorkspaceMember_roleId_idx" ON "WorkspaceMember"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvitation_tokenHash_key" ON "WorkspaceInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_workspaceId_email_idx" ON "WorkspaceInvitation"("workspaceId", "email");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_workspaceId_status_idx" ON "WorkspaceInvitation"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_expiresAt_idx" ON "WorkspaceInvitation"("expiresAt");

-- CreateIndex
CREATE INDEX "Application_workspaceId_status_idx" ON "Application"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "Application_workspaceId_type_idx" ON "Application"("workspaceId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Application_workspaceId_slug_key" ON "Application"("workspaceId", "slug");

-- CreateIndex
CREATE INDEX "ApplicationEnvironment_applicationId_status_idx" ON "ApplicationEnvironment"("applicationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationEnvironment_applicationId_type_key" ON "ApplicationEnvironment"("applicationId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationCredential_secretHash_key" ON "ApplicationCredential"("secretHash");

-- CreateIndex
CREATE INDEX "ApplicationCredential_environmentId_idx" ON "ApplicationCredential"("environmentId");

-- CreateIndex
CREATE INDEX "ApplicationCredential_keyPrefix_idx" ON "ApplicationCredential"("keyPrefix");

-- CreateIndex
CREATE INDEX "ApplicationCredential_expiresAt_idx" ON "ApplicationCredential"("expiresAt");

-- CreateIndex
CREATE INDEX "ApplicationCredential_environmentId_revokedAt_idx" ON "ApplicationCredential"("environmentId", "revokedAt");

-- CreateIndex
CREATE INDEX "ContentModelVersion_modelId_createdAt_idx" ON "ContentModelVersion"("modelId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContentModelVersion_modelId_version_key" ON "ContentModelVersion"("modelId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "ContentModelVersion_modelId_id_key" ON "ContentModelVersion"("modelId", "id");

-- CreateIndex
CREATE INDEX "ContentModel_applicationId_status_idx" ON "ContentModel"("applicationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ContentModel_applicationId_slug_key" ON "ContentModel"("applicationId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ContentModel_applicationId_id_key" ON "ContentModel"("applicationId", "id");

-- CreateIndex
CREATE INDEX "ContentField_modelId_parentId_idx" ON "ContentField"("modelId", "parentId");

-- CreateIndex
CREATE INDEX "ContentField_modelId_sortOrder_idx" ON "ContentField"("modelId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ContentField_modelId_id_key" ON "ContentField"("modelId", "id");

-- CreateIndex
CREATE INDEX "ContentEntry_modelId_status_idx" ON "ContentEntry"("modelId", "status");

-- CreateIndex
CREATE INDEX "ContentEntry_modelId_visibility_status_idx" ON "ContentEntry"("modelId", "visibility", "status");

-- CreateIndex
CREATE INDEX "ContentEntry_modelId_updatedAt_idx" ON "ContentEntry"("modelId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntry_modelId_externalId_key" ON "ContentEntry"("modelId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntry_modelId_slug_key" ON "ContentEntry"("modelId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntry_modelId_id_key" ON "ContentEntry"("modelId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntry_id_currentDraftVersionId_key" ON "ContentEntry"("id", "currentDraftVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntry_id_publishedVersionId_key" ON "ContentEntry"("id", "publishedVersionId");

-- CreateIndex
CREATE INDEX "ContentVersion_entryId_createdAt_idx" ON "ContentVersion"("entryId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentVersion_entryId_status_idx" ON "ContentVersion"("entryId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ContentVersion_entryId_version_key" ON "ContentVersion"("entryId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "ContentVersion_entryId_id_key" ON "ContentVersion"("entryId", "id");

-- CreateIndex
CREATE INDEX "ContentRelationDefinition_applicationId_idx" ON "ContentRelationDefinition"("applicationId");

-- CreateIndex
CREATE INDEX "ContentRelationDefinition_sourceModelId_idx" ON "ContentRelationDefinition"("sourceModelId");

-- CreateIndex
CREATE INDEX "ContentRelationDefinition_targetModelId_idx" ON "ContentRelationDefinition"("targetModelId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentRelationDefinition_applicationId_key_key" ON "ContentRelationDefinition"("applicationId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "ContentRelationDefinition_applicationId_id_key" ON "ContentRelationDefinition"("applicationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "ContentRelationDefinition_applicationId_id_sourceModelId_ta_key" ON "ContentRelationDefinition"("applicationId", "id", "sourceModelId", "targetModelId");

-- CreateIndex
CREATE INDEX "ContentEntryRelation_sourceEntryId_idx" ON "ContentEntryRelation"("sourceEntryId");

-- CreateIndex
CREATE INDEX "ContentEntryRelation_targetEntryId_idx" ON "ContentEntryRelation"("targetEntryId");

-- CreateIndex
CREATE INDEX "ContentEntryRelation_definitionId_sourceEntryId_idx" ON "ContentEntryRelation"("definitionId", "sourceEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntryRelation_definitionId_sourceEntryId_targetEntry_key" ON "ContentEntryRelation"("definitionId", "sourceEntryId", "targetEntryId");

-- CreateIndex
CREATE INDEX "ContentEntryAccessGrant_entryId_userId_idx" ON "ContentEntryAccessGrant"("entryId", "userId");

-- CreateIndex
CREATE INDEX "ContentEntryAccessGrant_entryId_email_idx" ON "ContentEntryAccessGrant"("entryId", "email");

-- CreateIndex
CREATE INDEX "ContentEntryAccessGrant_entryId_revokedAt_idx" ON "ContentEntryAccessGrant"("entryId", "revokedAt");

-- CreateIndex
CREATE INDEX "ContentEntryUniqueValue_entryId_idx" ON "ContentEntryUniqueValue"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntryUniqueValue_modelId_fieldId_entryId_key" ON "ContentEntryUniqueValue"("modelId", "fieldId", "entryId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntryUniqueValue_modelId_fieldId_valueHash_key" ON "ContentEntryUniqueValue"("modelId", "fieldId", "valueHash");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceRole" ADD CONSTRAINT "WorkspaceRole_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_roleId_fkey" FOREIGN KEY ("workspaceId", "roleId") REFERENCES "WorkspaceRole"("workspaceId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_workspaceId_roleId_fkey" FOREIGN KEY ("workspaceId", "roleId") REFERENCES "WorkspaceRole"("workspaceId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationEnvironment" ADD CONSTRAINT "ApplicationEnvironment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCredential" ADD CONSTRAINT "ApplicationCredential_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "ApplicationEnvironment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCredential" ADD CONSTRAINT "ApplicationCredential_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentModelVersion" ADD CONSTRAINT "ContentModelVersion_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ContentModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentModelVersion" ADD CONSTRAINT "ContentModelVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentModel" ADD CONSTRAINT "ContentModel_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentField" ADD CONSTRAINT "ContentField_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ContentModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentField" ADD CONSTRAINT "ContentField_modelId_parentId_fkey" FOREIGN KEY ("modelId", "parentId") REFERENCES "ContentField"("modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntry" ADD CONSTRAINT "ContentEntry_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ContentModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntry" ADD CONSTRAINT "ContentEntry_id_currentDraftVersionId_fkey" FOREIGN KEY ("id", "currentDraftVersionId") REFERENCES "ContentVersion"("entryId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntry" ADD CONSTRAINT "ContentEntry_id_publishedVersionId_fkey" FOREIGN KEY ("id", "publishedVersionId") REFERENCES "ContentVersion"("entryId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntry" ADD CONSTRAINT "ContentEntry_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntry" ADD CONSTRAINT "ContentEntry_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentVersion" ADD CONSTRAINT "ContentVersion_modelId_entryId_fkey" FOREIGN KEY ("modelId", "entryId") REFERENCES "ContentEntry"("modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentVersion" ADD CONSTRAINT "ContentVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentVersion" ADD CONSTRAINT "ContentVersion_modelId_schemaVersion_fkey" FOREIGN KEY ("modelId", "schemaVersion") REFERENCES "ContentModelVersion"("modelId", "version") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentRelationDefinition" ADD CONSTRAINT "ContentRelationDefinition_applicationId_sourceModelId_fkey" FOREIGN KEY ("applicationId", "sourceModelId") REFERENCES "ContentModel"("applicationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentRelationDefinition" ADD CONSTRAINT "ContentRelationDefinition_applicationId_targetModelId_fkey" FOREIGN KEY ("applicationId", "targetModelId") REFERENCES "ContentModel"("applicationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntryRelation" ADD CONSTRAINT "ContentEntryRelation_applicationId_definitionId_sourceMode_fkey" FOREIGN KEY ("applicationId", "definitionId", "sourceModelId", "targetModelId") REFERENCES "ContentRelationDefinition"("applicationId", "id", "sourceModelId", "targetModelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntryRelation" ADD CONSTRAINT "ContentEntryRelation_sourceModelId_sourceEntryId_fkey" FOREIGN KEY ("sourceModelId", "sourceEntryId") REFERENCES "ContentEntry"("modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntryRelation" ADD CONSTRAINT "ContentEntryRelation_targetModelId_targetEntryId_fkey" FOREIGN KEY ("targetModelId", "targetEntryId") REFERENCES "ContentEntry"("modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntryAccessGrant" ADD CONSTRAINT "ContentEntryAccessGrant_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "ContentEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntryAccessGrant" ADD CONSTRAINT "ContentEntryAccessGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntryUniqueValue" ADD CONSTRAINT "ContentEntryUniqueValue_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ContentModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntryUniqueValue" ADD CONSTRAINT "ContentEntryUniqueValue_modelId_fieldId_fkey" FOREIGN KEY ("modelId", "fieldId") REFERENCES "ContentField"("modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEntryUniqueValue" ADD CONSTRAINT "ContentEntryUniqueValue_modelId_entryId_fkey" FOREIGN KEY ("modelId", "entryId") REFERENCES "ContentEntry"("modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Ensure only one active draft version exists per content entry.
CREATE UNIQUE INDEX "ContentVersion_one_draft_per_entry"
ON "ContentVersion" ("entryId")
WHERE "status" = 'DRAFT';


-- Ensure root-level field keys are unique within a content model.
CREATE UNIQUE INDEX "ContentField_root_key_unique"
ON "ContentField" ("modelId", "key")
WHERE "parentId" IS NULL;


-- Ensure child field keys are unique among siblings.
CREATE UNIQUE INDEX "ContentField_sibling_key_unique"
ON "ContentField" ("modelId", "parentId", "key")
WHERE "parentId" IS NOT NULL;


-- Every access grant must identify exactly one principal:
-- either a user or an email address, never both or neither.
ALTER TABLE "ContentEntryAccessGrant"
ADD CONSTRAINT "ContentEntryAccessGrant_exactly_one_principal_check"
CHECK (
  ("userId" IS NOT NULL AND "email" IS NULL)
  OR
  ("userId" IS NULL AND "email" IS NOT NULL)
);