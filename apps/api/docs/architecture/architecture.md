# Logifex Content Engine — System Architecture

**Status:** Initial architecture
**Architecture style:** Layered, domain-oriented architecture with explicit boundaries
**Runtime:** TypeScript, Hono, Prisma, PostgreSQL
**Protocol:** Logifex Protocol

---

## 1. Purpose

The Logifex Content Engine is a general-purpose, multi-tenant content management
system designed to serve multiple applications and different types of projects.

It is not limited to portfolio websites.

Applications can manage their own content models, fields, entries, versions,
relationships and publishing workflows through the Content Engine.

The system must maintain clear boundaries between identity, workspaces,
applications, authorization, content management and infrastructure.

---

## 2. Architectural Principles

### 2.1 Protocol independence

Logifex Protocol is an independent TypeScript framework.

The Content Engine consumes the capabilities provided by Logifex Protocol
without making the Protocol dependent on Content Engine requirements.

Content Engine-specific functionality belongs to the Content Engine.

### 2.2 Explicit boundaries

Every domain and architectural layer has defined responsibilities.

A feature must be implemented in the layer that owns its responsibility.

### 2.3 Dependency direction

Dependencies should point inward toward application and domain abstractions.

Infrastructure implementations must not become the source of domain rules.

### 2.4 Multi-tenancy

A workspace is the primary ownership boundary.

Applications belong to workspaces. Content models and content entries belong
to applications.

Every application operation must enforce the appropriate tenant boundary.

### 2.5 Application independence

An application integrates with the Content Engine through its API and
application credentials.

External applications do not need to implement Logifex Protocol.

### 2.6 Incremental architecture

The initial implementation remains inside `apps/api`.

Internal boundaries must remain clear enough to allow future extraction
into independent packages when justified.

---

## 3. System Architecture

The initial system is organized into four application layers.

### 3.1 Presentation Layer

Responsibilities:

- Hono HTTP routes
- Request and response handling
- Middleware
- Request validation
- DTO mapping
- HTTP error translation

Presentation code must not contain core business rules.

### 3.2 Application Layer

Responsibilities:

- Use cases
- Workflow orchestration
- Authorization coordination
- Transaction coordination
- Application-level policies

The application layer coordinates domain behavior and infrastructure ports.

### 3.3 Domain Layer

Responsibilities:

- Business rules
- Domain entities and value objects
- Domain invariants
- Content lifecycle rules
- Workspace and application rules
- Domain-level validation

The domain layer must not depend directly on Hono or Prisma.

### 3.4 Infrastructure Layer

Responsibilities:

- Prisma persistence
- PostgreSQL integration
- External services
- Storage adapters
- Infrastructure implementations of application ports

Infrastructure implements technical requirements without owning business policy.

---

## 4. Domain Boundaries

### 4.1 Identity

Owns user identity and account lifecycle.

Existing authentication functionality will be audited and adapted rather
than replaced without justification.

### 4.2 Workspace

Owns:

- Workspace lifecycle
- Workspace ownership
- Membership
- Workspace roles
- Invitations

Users may belong to multiple workspaces with different roles.

### 4.3 Application

Owns:

- Application registration
- Application lifecycle
- Integration mode
- Environments
- Application credentials

Applications belong to workspaces.

Integration modes:

- MANAGED
- EXTERNAL

### 4.4 Authorization

Coordinates human and machine access.

Human authorization is based on workspace ownership and membership permissions.

Machine authorization is based on application credentials, environment
status and credential scopes.

Global user roles must not replace workspace-level authorization.

### 4.5 Content Model

Owns:

- Content model definitions
- Field definitions
- Field configuration
- Model schema versions
- Model validation rules

Content models belong to applications.

### 4.6 Content Entry

Owns:

- Entry creation
- Entry updates
- Entry validation
- Entry lifecycle
- Entry version history
- Publishing and restoration

### 4.7 Content Relations

Owns relationships between content entries according to their
application-level relation definitions.

---

## 5. High-Level Ownership Hierarchy

The ownership hierarchy is:

User
  └── Workspace
        ├── Workspace Members
        ├── Workspace Roles
        └── Applications
              ├── Environments
              │     └── Application Credentials
              └── Content Models
                    ├── Content Fields
                    ├── Content Entries
                    │     ├── Content Versions
                    │     └── Content Relations
                    └── Content Model Versions

This represents logical ownership, not necessarily the physical database
relationship of every record.

---

## 6. Logifex Protocol Integration

Logifex Protocol remains an independent framework.

The Content Engine will:

1. Inspect and verify the actual capabilities of the installed Protocol packages.
2. Reuse existing Protocol contracts where they fit their intended purpose.
3. Implement missing Content Engine-specific behavior locally.
4. Connect implementations through appropriate adapters and composition roots.
5. Avoid modifying official Protocol packages merely to accommodate this application.

Exact package APIs and integration points are pending source inspection.

---

## 7. Composition Root

The application composition root is responsible for constructing and connecting
the application's implementations.

It must keep dependency wiring explicit.

The exact composition-root location and registration strategy will be
documented after inspecting the existing API entry point and Protocol APIs.

---

## 8. Infrastructure and Persistence

The initial persistence stack is:

- PostgreSQL
- Prisma ORM

The database schema provides persistence structures.

Business rules, authorization policies, validation and lifecycle transitions
must be enforced by the appropriate application and domain services.

Database constraints should reinforce important integrity requirements.

---

## 9. Security Requirements

The system must enforce:

- Workspace isolation
- Application isolation
- Environment-specific machine credentials
- Credential revocation and expiration
- Workspace-level human authorization
- Protected content access
- Server-side authorization for content and assets

Protected data must never be exposed to unauthorized clients and merely
hidden through frontend presentation.

---

## 10. Testing Strategy

The architecture must support:

- Domain unit tests
- Application use-case tests
- Infrastructure integration tests
- API integration tests
- Authorization tests
- Tenant-isolation tests
- Protocol contract tests where applicable
- Architectural boundary checks

Critical invariants must be tested independently of HTTP routes.

---

## 11. Implementation Constraints

- Keep the initial implementation inside `apps/api`.
- Do not introduce unnecessary independent packages.
- Do not make Content Engine-specific changes to official Logifex Protocol.
- Do not treat the legacy portfolio CMS as the new Content Engine architecture.
- Reuse existing authentication functionality after auditing its responsibilities.
- Do not apply database migrations until the schema and migration strategy
  have been reviewed.
- Do not assume a Protocol capability exists until its actual implementation
  and API have been inspected.

---

## 12. Open Architectural Decisions

The following require further investigation or explicit decisions:

- Exact Logifex Protocol integration APIs
- Internal directory and module structure
- Domain event handling
- Invariant enforcement strategy
- Workspace ownership transfer
- Workspace invitation lifecycle
- Application credential issuance and rotation
- Content schema migration behavior
- Multiple concurrent draft policy
- Asset storage and access architecture
- Public API query and publishing policies

These decisions will be recorded in dedicated architecture documents or ADRs.

---

## 13. Architecture Decision Authority

The architecture documents and accepted ADRs are the source of truth for
implementation decisions.

Implementation must follow documented boundaries.

When implementation reveals a necessary architectural change, document and
review that change instead of silently violating the established rules.
