# ADR-005: Content Engine Domain Boundaries and Dependency Architecture

**Status:** Accepted
**Scope:** Logifex Content Engine
**Date:** 2026-11-12

## Context

The Content Engine is a general-purpose, multi-tenant content platform. It must support multiple workspaces, applications, environments, content models, content entries, and external integrations.

The existing portfolio CMS is a legacy implementation and must not define the architecture of the new Content Engine.

Logifex Protocol is an independent framework. The Content Engine consumes existing Protocol capabilities when they fit, without introducing Content Engine-specific requirements into the official Protocol.

## Decision 1: Domain boundaries

The system is divided into the following domains:

1. Identity
2. Workspace
3. Application
4. Authorization
5. Content Model
6. Content Entry
7. Content Relations

Future capabilities may include Asset, Page Builder, Localization, Integration, SEO, Analytics, and Scheduled Publishing engines.

These future capabilities must not be prematurely coupled to the initial Content Engine implementation.

## Decision 2: Ownership hierarchy

The ownership hierarchy is:

User → Workspace → Application → Content Model → Content Entries.

A user may participate in multiple workspaces. Workspaces own applications. Applications own their content models and environments.

Content models and their entries are scoped to one application in the initial architecture.

The `EXTERNAL` application integration mode does not change workspace or application ownership.

## Decision 3: Authorization

Authentication identifies the user or application credential.

Authorization determines whether that identity can perform an operation on a specific resource.

Workspace roles and permissions are workspace-scoped. Global legacy user roles must not automatically grant workspace permissions.

Application credentials are environment-scoped and must be validated independently of user authentication.

All protected content and asset access must be enforced server-side.

## Decision 4: Content persistence

Content model definitions and relationships use relational database structures.

Content entry values use JSONB.

Content model versions preserve immutable schema snapshots. Content versions preserve immutable content snapshots and record the schema version used to validate them.

Unique fields require actual transactional or database-level enforcement. A metadata flag alone is insufficient.

Content relations must remain within the same application. Relation cardinality must be enforced by application-level transactional logic.

## Decision 5: Publishing and version history

Creating an entry creates its initial draft version atomically.

Each edit creates a new version. Draft changes must not modify the published snapshot.

Public content reads must resolve through the published-version pointer rather than the current draft data.

Publishing must update the published pointer and related statuses transactionally.

Unpublishing clears the published pointer without deleting historical versions.

Restoring a historical version creates a new version rather than modifying existing history.

Updates use optimistic concurrency through an expected version.

The initial implementation supports one active draft per entry.

## Decision 6: Application architecture

The API uses four architectural layers:

- Presentation
- Application
- Domain
- Infrastructure

Dependencies must point inward. Domain logic must not depend on frameworks, database clients, or external providers.

Cross-domain operations use explicit contracts and application-level orchestration.

The composition root is responsible for dependency wiring.

The initial implementation remains inside `apps/api`. Physical service extraction is deferred until there is a demonstrated need.

## Decision 7: Logifex Protocol

The Content Engine does not modify official Logifex Protocol packages to satisfy product-specific requirements.

Existing Protocol capabilities may be adopted when their contracts fit the Content Engine.

Protocol EventBus must not be treated as durable event delivery infrastructure.

Durable publishing events, retries, and outbox persistence remain Content Engine responsibilities.

Plugin execution and sandboxing are not part of the initial implementation.

## Decision 8: Legacy CMS

The existing portfolio CMS remains isolated from the new Content Engine.

Existing authentication or infrastructure components may be reused only after their responsibilities and dependencies have been reviewed.

Legacy content services must not become dependencies of the new Content Engine domains.

## Consequences

- Domain boundaries remain independent of the HTTP framework and database implementation.
- Tenant isolation becomes an explicit architectural responsibility.
- Publishing and version history receive transactional guarantees.
- The Content Engine can support external applications without requiring them to implement Logifex Protocol.
- Future engines can be introduced without restructuring the core domains.
- Some infrastructure, particularly durable events and asset access, must be implemented by the Content Engine rather than assumed to exist in Protocol.

## Deferred decisions

- Dedicated database deployment for enterprise tenants.
- Multiple simultaneous drafts per entry.
- Plugin execution runtime.
- Scheduled publishing.
- Cross-application content relations.
- Localization and advanced publishing workflows.