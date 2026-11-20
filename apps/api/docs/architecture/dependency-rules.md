# Dependency Rules

**Status:** Initial architecture
**Parent document:** [System Architecture](./architecture.md)

---

## 1. Purpose

This document defines allowed and prohibited dependencies within the
Logifex Content Engine.

The objective is to preserve architectural boundaries and prevent
infrastructure, framework and transport concerns from leaking into domain
logic.

---

## 2. Architectural Layers

The application uses four internal layers:

1. Presentation
2. Application
3. Domain
4. Infrastructure

These layers initially live inside `apps/api`.

Their physical location does not change their logical dependency rules.

---

## 3. Dependency Direction

The intended dependency direction is:

Presentation → Application → Domain

Infrastructure implements contracts required by the application and domain.

The application composition root connects implementations to their
consumers.

Infrastructure dependencies must not leak into domain rules.

---

## 4. Layer Responsibilities and Allowed Dependencies

### 4.1 Presentation

May depend on:

- Application use cases
- Request and response DTOs
- Request validation
- Authentication and authorization middleware
- HTTP error translation

Must not depend directly on:

- Prisma models as public API contracts
- Database implementation details for business decisions
- Internal domain persistence details
- Unrelated domain implementations

### 4.2 Application

May depend on:

- Domain entities and rules
- Domain services
- Application ports and contracts
- Transaction abstractions
- Explicitly defined cross-domain interfaces

Must not depend directly on:

- Hono request or response objects
- HTTP-specific status handling
- Frontend implementation details
- Concrete database clients throughout use cases

### 4.3 Domain

May depend on:

- Other domain abstractions when explicitly justified
- Pure TypeScript utilities
- Its own domain types and contracts

Must not depend on:

- Hono
- Prisma Client
- PostgreSQL drivers
- HTTP transport
- Frontend frameworks
- Environment-specific infrastructure

### 4.4 Infrastructure

May depend on:

- Prisma Client
- PostgreSQL
- External service SDKs
- Application and domain contracts
- Infrastructure configuration

Must implement the contracts it is responsible for without taking ownership
of domain business rules.

---

## 5. Cross-Domain Dependencies

Domains must not access each other's internal implementation directly.

When one domain requires another domain's capability, use an explicitly
defined application-level contract or orchestration workflow.

Examples:

- Content operations require application authorization.
- Application operations require workspace ownership validation.
- Workspace invitations require identity and membership coordination.
- Publishing requires content validation and version lifecycle coordination.

Cross-domain workflows belong in the application layer.

---

## 6. Logifex Protocol Dependency Rules

Logifex Protocol remains an independent framework.

The Content Engine may depend on official Protocol packages when their
documented contracts match the required responsibility.

Rules:

- Protocol packages must not import Content Engine modules.
- Content Engine modules may consume Protocol contracts.
- Content Engine-specific policies remain inside the Content Engine.
- Adapters must isolate differences between Protocol contracts and
  application-specific implementations.
- No Protocol API may be assumed without source or package documentation
  verification.

Protocol package responsibilities must be documented after inspecting
their actual source.

---

## 7. Composition Root

Concrete implementations must be connected at explicit composition roots.

The composition root may import:

- Application use cases
- Infrastructure implementations
- Protocol integrations
- API route registration

Business logic must not construct its own global infrastructure dependencies.

The exact composition-root location is pending inspection of the existing
API entry point.

---

## 8. Database Access Rules

- Prisma access belongs in infrastructure implementations.
- Domain rules must not query Prisma directly.
- Application use cases coordinate persistence through defined contracts.
- Tenant-scoped operations must include the appropriate workspace or
  application boundary.
- Database transactions must protect multi-step lifecycle operations.
- Database constraints should reinforce important integrity rules.

---

## 9. Authentication and Authorization Rules

- Authentication establishes identity.
- Authorization evaluates permission.
- Global user roles must not substitute for workspace membership roles.
- Human access and machine credential access must remain distinguishable.
- Application credentials must be scoped to their environment.
- Every protected application operation must enforce application and
  workspace lifecycle restrictions.

---

## 10. Testing and Enforcement

Dependency rules should be verified through:

- TypeScript compilation
- Unit tests
- Integration tests
- Architecture boundary tests
- Protocol contract tests where applicable

A dependency rule is not considered enforced merely because it is documented.

Automated checks should be introduced as the module structure becomes stable.

---

## 11. Exceptions

An exception requires:

1. A documented reason.
2. An identified owner.
3. A description of the boundary affected.
4. An accepted Architecture Decision Record when the exception changes
   an architectural rule.

Temporary exceptions must not silently become permanent architecture.

---

## 12. Change Authority

Changes to dependency direction must be reviewed against the system
architecture and system boundaries documents.

Protocol changes must be evaluated independently from Content Engine changes.
