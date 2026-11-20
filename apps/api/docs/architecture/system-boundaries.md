# System Boundaries

**Status:** Initial architecture
**Parent document:** [System Architecture](./architecture.md)

---

## 1. Purpose

This document defines the responsibility and ownership boundaries of the
Logifex Content Engine.

Its purpose is to prevent responsibilities from leaking between domains,
architectural layers, infrastructure and Logifex Protocol.

A component must implement only responsibilities that belong to its boundary.

---

## 2. System-Level Boundaries

The system consists of the following major areas:

1. Logifex Protocol
2. Content Engine
3. Identity
4. Workspace Management
5. Application Management
6. Authorization
7. Content Management
8. Infrastructure

These areas may collaborate through explicitly defined contracts, but they
must not become tightly coupled implementations of one another.

---

## 3. Logifex Protocol Boundary

Logifex Protocol is an independent TypeScript framework.

It owns the reusable contracts and capabilities provided by its official
packages.

The Content Engine is a consumer of the Protocol.

### Responsibilities

- Provide its documented framework capabilities.
- Define and expose its own public contracts.
- Maintain independence from Content Engine business requirements.
- Preserve its intended package responsibilities.

### Restrictions

- Must not depend on Content Engine domain models.
- Must not contain workspace-specific business rules.
- Must not contain CMS-specific content models or publishing workflows.
- Must not be modified solely to accommodate Content Engine requirements.

### Integration rule

The Content Engine may use an existing Protocol capability when its actual
contract fits the responsibility.

If the required capability does not exist, implement it inside the
Content Engine.

Exact reusable capabilities must be verified against the actual Protocol
package source before implementation.

---

## 4. Content Engine Boundary

The Content Engine owns the business functionality required to manage content
for multiple independent applications.

### Responsibilities

- Content model management
- Content field definitions
- Schema validation
- Content entries
- Immutable content snapshots
- Content version history
- Publishing lifecycle
- Content relationships
- Content querying
- Application-level content isolation

### Restrictions

- Must not own general-purpose Protocol functionality.
- Must not make Protocol packages depend on CMS-specific concepts.
- Must not assume every integrated application uses the same frontend.
- Must not expose protected content without authorization.

---

## 5. Identity Boundary

Identity owns user accounts and authentication.

### Responsibilities

- User registration and account lifecycle
- Login and logout
- Access-token issuance and verification
- Refresh-token lifecycle
- Session management
- Account activation and deactivation

### Restrictions

- Authentication does not automatically grant access to a workspace.
- A user's global role is not a substitute for workspace permissions.
- Identity must not own application-specific content permissions.

---

## 6. Workspace Boundary

Workspace is the primary ownership and collaboration boundary.

### Responsibilities

- Workspace creation and lifecycle
- Workspace ownership
- Workspace members
- Workspace roles
- Workspace invitations
- Membership lifecycle

### Restrictions

- A workspace must not directly own content entries.
- Workspace membership must not imply access to every operation.
- Membership permissions must be evaluated using the assigned workspace role.
- Applications must belong to a workspace.

---

## 7. Application Boundary

Application represents an independent project integrated with the Content Engine.

### Responsibilities

- Application registration
- Application metadata
- Application lifecycle
- Integration mode
- Application environments
- Application credentials

### Restrictions

- An application cannot belong to multiple workspaces.
- Application integration mode does not change workspace ownership.
- Application credentials must be restricted to their intended environment.
- Application credentials must not be treated as human user sessions.

### Integration modes

- MANAGED
- EXTERNAL

An external application can consume the Content Engine through its API
without implementing Logifex Protocol.

---

## 8. Authorization Boundary

Authorization decides whether an authenticated human or machine identity
can perform a requested operation.

### Human access

Human access is evaluated through:

- User identity
- Workspace ownership
- Active workspace membership
- Assigned workspace role
- Required permission

### Machine access

Machine access is evaluated through:

- Application credential
- Credential revocation and expiration
- Environment status
- Application status
- Workspace status
- Credential scopes

### Restrictions

- Authentication and authorization are separate responsibilities.
- A valid JWT alone does not grant access to an application.
- A valid application credential alone does not bypass application or
  environment lifecycle restrictions.
- Tenant boundaries must be enforced server-side.

---

## 9. Content Domain Boundaries

### 9.1 Content Model

Owns the structure and schema of content.

It defines fields, types, configurations, validation metadata and schema
versions.

### 9.2 Content Entry

Owns content records and their lifecycle.

It manages creation, updates, version history, publishing and restoration.

### 9.3 Content Relations

Owns the definitions and records of relationships between entries.

Relationships must remain within their owning application.

### 9.4 Content Validation

Owns the rules used to validate content values against their model schema.

Validation must not depend on frontend-only checks.

### 9.5 Publishing

Owns the transition between draft and published content.

Public reads must use the published snapshot rather than uncommitted draft
data.

---

## 10. Infrastructure Boundary

Infrastructure provides technical implementations required by the application.

### Responsibilities

- Database persistence
- Prisma repositories and adapters
- PostgreSQL transactions
- External storage integrations
- External service integrations
- Infrastructure configuration

### Restrictions

- Infrastructure must not decide workspace permissions.
- Infrastructure must not silently bypass domain validation.
- Persistence models must not become the public API contract.
- Database access must preserve tenant boundaries.

---

## 11. Future Capability Boundaries

The following capabilities are intentionally separate from the initial
Content Engine implementation:

| Capability | Responsibility |
|---|---|
| Asset Engine | Asset storage, processing, metadata and access |
| Page Builder | Page composition and reusable content blocks |
| Access Control Engine | Visitor passwords and approved access |
| Localization Engine | Localized content and translation workflows |
| Integration Engine | Webhooks and external event delivery |
| Publishing Extensions | SEO and advanced publishing workflows |
| Analytics | Usage and content analytics |

These capabilities may integrate with the Content Engine through explicit
contracts when introduced.

They must not be prematurely merged into the initial content domain.

---

## 12. Boundary Enforcement

Boundaries must be maintained through:

- Explicit module ownership
- Dependency rules
- Application use cases
- Domain services
- Infrastructure adapters
- Authorization checks
- Automated architecture tests
- Architecture Decision Records

A feature crossing multiple boundaries must coordinate through the
appropriate application-level workflow rather than directly coupling
unrelated domain implementations.

---

## 13. Change Authority

A boundary may change only when there is a documented architectural reason.

Changes affecting Logifex Protocol must be evaluated independently from
Content Engine-specific changes.

Accepted architecture decisions and the parent architecture document
remain authoritative.
