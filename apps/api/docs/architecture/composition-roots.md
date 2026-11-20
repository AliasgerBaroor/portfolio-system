# Composition Roots

**Status:** Initial architecture
**Parent document:** [System Architecture](./architecture.md)

---

## 1. Purpose

This document defines where application dependencies are constructed,
configured and connected.

Composition roots are responsible for assembling the application from
its presentation, application, domain and infrastructure components.

Business logic must not construct global infrastructure dependencies
on its own.

---

## 2. Current Implementation

The current API entry point is:

`apps/api/index.ts`

It currently:

- Creates the Hono application.
- Configures CORS.
- Imports and mounts route modules.
- Defines the root health response.
- Starts the HTTP server using `@hono/node-server`.

The current implementation therefore combines application construction
and server startup in one file.

Existing route groups include:

- `/auth`
- `/portfolio`
- `/clients`
- `/client-access`

Existing authentication middleware and services are maintained separately.

---

## 3. Target Composition Structure

The intended structure separates application construction from server startup.

### 3.1 API application composition

`apps/api/app.ts`

Responsibilities:

- Create the Hono application.
- Register global middleware.
- Configure CORS.
- Mount presentation routes.
- Configure centralized HTTP error handling.
- Return the configured application.

This module must not start a network server.

### 3.2 Server startup

`apps/api/index.ts`

Responsibilities:

- Import the configured application.
- Start the HTTP server.
- Configure runtime-specific server options.

It must not contain domain business logic or infrastructure registration
that belongs in the application composition root.

### 3.3 Dependency composition

A dedicated composition module may construct and connect:

- Infrastructure adapters
- Application services
- Protocol integrations
- Domain dependencies
- Route dependencies

The exact module structure will be determined after inspecting the actual
Logifex Protocol APIs and existing service dependencies.

---

## 4. Dependency Construction Rules

- Construct concrete infrastructure implementations at composition roots.
- Inject dependencies into application use cases.
- Keep domain logic independent of Hono and Prisma.
- Avoid hidden global dependencies inside business services.
- Keep Protocol integration explicit.
- Do not instantiate duplicate database clients for individual use cases.

The existing Prisma singleton may remain the shared database client while
persistence boundaries are introduced incrementally.

---

## 5. Route Registration

Routes belong to the presentation layer.

Route registration must remain explicit.

The new Content Engine route groups will be mounted separately from
legacy portfolio routes.

The initial route structure is expected to distinguish:

- Identity routes
- Workspace routes
- Application routes
- Content model routes
- Content entry routes
- Content query routes

Exact endpoint names and route hierarchy are subject to API design.

---

## 6. Testing

The Hono application should be constructible without starting a network server.

This enables:

- Route integration tests
- Middleware tests
- Error-handling tests
- Authentication tests
- Authorization tests
- Content API tests

Composition tests should verify that required dependencies are available
and correctly connected.

---

## 7. Migration Strategy

The composition structure will be improved incrementally.

1. Preserve existing route behavior.
2. Separate Hono application construction from server startup.
3. Introduce explicit dependency composition.
4. Integrate Protocol capabilities through verified contracts.
5. Register new Content Engine routes independently.
6. Migrate existing authentication only where needed.
7. Keep legacy portfolio functionality isolated until its replacement
   is ready.

---

## 8. Open Decisions

- Exact dependency injection mechanism.
- Exact composition module location.
- Protocol lifecycle integration.
- Protocol event registration.
- Protocol invariant registration.
- Error translation strategy.
- Route dependency injection strategy.

These decisions require inspection of existing implementations and
Logifex Protocol package source.
