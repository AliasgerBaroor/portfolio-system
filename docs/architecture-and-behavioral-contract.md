# CMS Operation Lifecycle Specification

**Document ID:** LOGIFEX-CMS-OPS-001  
**Version:** 0.1.0-draft  
**Status:** Proposed  
**Architecture:** Logifex Protocol integration  
**Applies to:** `portfolio-platform` CMS dashboard

## 1. Purpose

Establish a consistent, testable system for coordinating CMS operations throughout the gradual migration of `portfolio-platform` toward Logifex Protocol architecture.

The system must protect content integrity, prevent stale asynchronous responses from corrupting the active editor, coordinate concurrent writes, preserve unsaved changes, and provide accurate operation status.

This specification defines application-level behavior. It does not introduce new Core primitives or change the guarantees of existing Protocol packages.

## 2. Architectural boundaries

### 2.1 Existing Protocol packages

**`@logifex-protocol/core`**

Use the existing Contract, Event, EventBus, Handler, and Lifecycle primitives according to their published semantics.

- Contracts specify shapes, behavior, and guarantees.
- Events represent immutable facts.
- EventBus publication does not guarantee handler completion, delivery, or ordering.
- Handlers implement reactions to events.
- Lifecycle manages resource lifecycle transitions.

**`@logifex-protocol/invariant`**

Register and govern applicable CMS invariants. An invariant's recorded enforcement status must reflect actual implementation and verification.

**`@logifex-protocol/plugin`**

Not required for the initial CMS operation system. Evaluate plugin integration only when a real extension requirement exists.

### 2.2 CMS application layer

The CMS owns:

- Operation coordination.
- Read cancellation and stale-response protection.
- Save scheduling and write concurrency.
- Document revisions and dirty-state tracking.
- Persistence adapters.
- CMS-specific operation events.
- User-visible operation status.

These responsibilities must not be moved into Core merely because the CMS uses Protocol primitives.

## 3. Content hierarchy and operation identity

The CMS content hierarchy is:

Portfolio → Collection → Item → Section → Block.

Each operation must identify its actual target and relevant context.

A block operation should identify the portfolio, collection, item, section, and block where applicable. A section operation must identify its section and parent context.

An operation record should contain, at minimum:

- `operationId`: unique identifier for the operation.
- `kind`: read, save, create, update, delete, or publish.
- `target`: typed identity of the affected entity.
- `status`: current operation state.
- `startedAt`: operation start time.
- `completedAt`: completion time, when available.
- `error`: structured failure details, when applicable.

Read operations should additionally carry a selection or request generation identifier.

Write operations should additionally track the submitted document revision and, where supported, the expected persisted revision.

These fields are proposed CMS contracts, not existing exports from Logifex Protocol.

## 4. Operation state model

### 4.1 Standard operation states

- `pending`: accepted but not yet executing.
- `running`: executing.
- `succeeded`: confirmed successful completion.
- `failed`: confirmed failure.
- `cancelled`: cancellation was confirmed or the operation was prevented from executing.
- `conflicted`: rejected because its expected version or revision is stale.
- `outcome-unknown`: the client cannot establish whether the server committed the operation.

Terminal states are `succeeded`, `failed`, `cancelled`, `conflicted`, and `outcome-unknown`. An unknown outcome may later be reconciled using authoritative server state.

An aborted HTTP request alone must not be interpreted as proof that a server-side write was cancelled.

### 4.2 Valid transitions

Typical transitions:

`pending → running`

`pending → cancelled`

`running → succeeded`

`running → failed`

`running → cancelled` only when cancellation is confirmed

`running → conflicted`

`running → outcome-unknown`

`outcome-unknown → succeeded | failed | conflicted` after authoritative reconciliation.

Invalid transitions must not silently change operation state.

## 5. Read operation guarantees

Read operations include loading collections, items, sections, blocks, and content needed by Rich Text or Block View.

Requirements:

1. A new selection invalidates the relevance of prior selection-specific responses.
2. Abort obsolete requests where practical.
3. Guard state updates with request identity or a generation token.
4. Never apply a response to a different selected entity.
5. Do not let an aborted read change the status of a newer request.
6. Represent loading, empty, and error states distinctly.

The generation check remains necessary even when AbortController is used because a request may finish before cancellation takes effect.

Cancellation is a resource-management optimization; stale-response protection is the correctness guarantee.

## 6. Write operation guarantees

Write operations include creating, updating, deleting, and saving blocks, sections, and items.

Requirements:

1. A save must identify the entity and revision it submits.
2. New edits made during an in-flight save must remain dirty until those edits are persisted.
3. Writes targeting the same entity must be coordinated to prevent stale writes.
4. Writes to independent entities may execute concurrently when their dependencies permit it.
5. A late response must not replace newer local editor state.
6. A save must not be reported as successful until the relevant persistence guarantee is satisfied.
7. A network failure or timeout must not be treated as proof that the server did not commit.
8. Retrying non-idempotent operations requires an idempotency strategy or equivalent reconciliation.
9. Failed saves must preserve recoverable user edits.
10. Server-side authorization and data integrity remain authoritative.

The initial implementation should serialize writes per entity and coalesce rapid edits where safe. Coalescing must never discard a revision that is required for a distinct operation.

## 7. Revision and dirty-state model

For each editable entity, maintain:

- `localRevision`: the latest locally accepted revision.
- `persistedRevision`: the latest revision confirmed persisted.
- `inFlightRevision`: the revision currently being submitted, if any.
- `saveStatus`: the current persistence status.

The entity is dirty whenever its latest local revision is not confirmed persisted.

A successful save of revision N must not mark revision N+1 as saved if N+1 was created while N was in flight.

The backend should enforce optimistic concurrency using a version, revision, or equivalent conditional-update mechanism when concurrent editors or tabs can modify the same entity.

Local serialization prevents overlapping writes within one coordinator; it does not replace backend concurrency control.

## 8. Navigation and view-switching behavior

### 8.1 Collection, item, section, and block navigation

Navigation should remain available during ordinary background saves.

Before navigation:

- Preserve edits in the canonical local document state.
- Keep pending saves associated with their original targets.
- Cancel or invalidate obsolete reads.
- Continue or await pending writes according to the operation's safety requirements.
- Never silently discard unsaved changes.

If a user explicitly chooses to discard edits, the application must define what is discarded and must not imply that an already-submitted server write has been rolled back.

### 8.2 Rich Text and Block View

Both views must use a shared canonical document state or a formally coordinated representation.

Switching views must not:

- Reset the document to an older server response.
- Create duplicate blocks.
- Lose block IDs, types, visibility, order, or section boundaries.
- Convert existing blocks destructively without an explicit migration rule.

A view switch should not require a save unless a documented conversion or persistence boundary makes it necessary.

## 9. Destructive operations and publishing

### Delete

- Prevent conflicting operations on the entity while deletion is unresolved.
- Confirm the server outcome before treating the entity as deleted.
- Reconcile uncertain outcomes instead of blindly repeating the delete.

### Publish

Publishing must establish a consistent persisted state for all content included in the publication.

Before publishing:

1. Identify the exact content scope.
2. Wait for required pending writes to complete.
3. Resolve failures and revision conflicts.
4. Verify that the publication request references the intended persisted revision or snapshot.
5. Disable duplicate publication submissions while the same publication operation is active.

The backend must enforce the publication boundary. A frontend-only check is insufficient if other clients can edit concurrently.

## 10. Operation events

Events may communicate confirmed domain outcomes, for example:

- `cms.block.save.succeeded`
- `cms.block.save.failed`
- `cms.block.save.conflicted`
- `cms.section.load.succeeded`
- `cms.content.publish.succeeded`

Final names and payloads must be standardized before implementation.

Events represent facts, not commands. Publish a success event only after the corresponding success condition has been established.

EventBus delivery and ordering must not be used as the mechanism that guarantees persistence ordering. The CMS coordinator or backend must provide those guarantees independently.

## 11. Proposed CMS invariants

These are proposed invariants to be registered and governed through `@logifex-protocol/invariant`. Their enforcement status must not be overstated.

**CMS-OPS-001 — Target integrity**

An operation result must not mutate an unrelated entity's state.

**CMS-OPS-002 — Stale read isolation**

A response from an obsolete selection must not replace the active selection's content.

**CMS-OPS-003 — Revision integrity**

A confirmed save of an older revision must not mark a newer local revision as persisted.

**CMS-OPS-004 — Write ordering**

Conflicting writes to the same entity must not silently overwrite newer accepted changes.

**CMS-OPS-005 — Persistence truthfulness**

The interface must not report unsaved content as saved.

**CMS-OPS-006 — Edit preservation**

A failed or uncertain save must not silently discard recoverable local edits.

**CMS-OPS-007 — Publication consistency**

A publication must not knowingly omit required pending changes or publish an unintended revision.

**CMS-OPS-008 — Cancellation truthfulness**

Client-side cancellation must not be represented as confirmed server-side rollback without evidence.

## 12. Acceptance tests

The initial implementation is not complete until these scenarios pass:

1. Start loading section A, switch to section B, then resolve A after B. B remains selected and A's response does not overwrite it.
2. Edit a block twice while its first save is pending. The first save succeeds, but the newer revision remains dirty until persisted.
3. Start saving block A, navigate to block B, and complete A's save. A is updated correctly and B's editor state is unaffected.
4. Return a server error during save. The local edit remains recoverable and the UI reports failure.
5. Abort a write after submission. The application reconciles the outcome instead of assuming rollback.
6. Submit two conflicting writes to one entity. The coordination or version check prevents a silent stale overwrite.
7. Switch between Rich Text and Block View. Block identity, metadata, order, and content remain consistent.
8. Attempt publication with a required save pending. Publication waits or rejects safely.
9. Trigger duplicate delete or publish actions. The application prevents unsafe duplicate submissions.
10. Refresh or unmount the editor while writes are pending. The application follows its documented persistence and recovery policy without claiming unconfirmed success.

## 13. Migration strategy

**Phase 1 — Specification and contracts**

Approve operation identity, state transitions, revision semantics, and invariants.

**Phase 2 — Single-block vertical slice**

Implement a save coordinator for one block and test the acceptance cases involving concurrency, errors, and stale responses.

**Phase 3 — Read coordination**

Apply request cancellation and stale-response protection to collection, item, section, and block loading.

**Phase 4 — Hierarchical persistence**

Extend the coordinator to sections and items, keeping existing CMS services as adapters.

**Phase 5 — Unified editor state**

Integrate Rich Text and Block View without destructive content conversion.

**Phase 6 — Backend guarantees**

Add version checks, conflict handling, idempotency where needed, and publication consistency.

**Phase 7 — Protocol integration**

Integrate existing Core primitives and Invariant governance where justified. Do not add new Core primitives or require a plugin merely to complete the CMS implementation.

## 14. Definition of done

The operation lifecycle system is ready for broader CMS adoption when:

- Its contracts and state transitions are documented and tested.
- Read races cannot corrupt the active selection.
- Concurrent saves cannot silently overwrite newer edits.
- Failed and uncertain writes preserve recoverable changes.
- Rich Text and Block View remain consistent.
- Publication operates on the intended persisted content.
- Invariant statuses reflect actual enforcement.
- Existing Core semantics are preserved.
- The implementation can be adopted incrementally without rewriting the entire CMS.
