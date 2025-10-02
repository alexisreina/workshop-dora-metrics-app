# Tasks: Jira Active Ticket Listing

**Input**: Design documents from `/specs/001-i-wish-to/`  
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Phase 3.1: Setup
- [X] T001 Update `.env.example` and `nuxt.config.ts` to expose `JIRA_BASE_URL`, `JIRA_CLIENT_ID`, and `JIRA_CLIENT_SECRET` via runtime config with secure defaults.
- [ ] T002 Create Jira test utilities in `tests/utils/jiraMock.ts` for OAuth token, paginated search responses, and error payloads (MSW/vi-fetch mocks).

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T003 [P] Add contract test `tests/contract/api/jira/active-tickets.contract.spec.ts` validating `/api/jira/active-tickets` against `contracts/active-tickets.openapi.json`, including cache metadata fields and key/summary payload expectations (covers FR-001, FR-003, FR-011).
- [ ] T004 [P] Add unit tests `tests/unit/server/utilities/caching/ttl-cache.spec.ts` covering cache set/get, jitter application, and TTL expiry beyond five minutes (covers FR-007, FR-011).
- [ ] T005 [P] Add unit tests `tests/unit/server/utilities/jira/client.spec.ts` for OAuth token refresh, multi-page pagination (>50 issues), and error propagation using required JQL (covers FR-002, FR-009, FR-010).
- [ ] T006 Add unit tests `tests/unit/server/api/jira/active-tickets.spec.ts` for handler behavior (401, 429 backoff, cache hit, telemetry emission, and actionable user-facing error messaging) ensuring current-user filtering (covers FR-001, FR-006, FR-008, FR-009).
- [ ] T007 [P] Add component tests `tests/unit/components/ticket-list/ActiveTicketsList.spec.ts` for loading, empty, error (message content), list rendering, and data freshness timestamp visibility (covers FR-004, FR-005, FR-008).
- [ ] T008 [P] Add integration test `tests/integration/pages/tickets-page.spec.ts` asserting `/tickets` route renders raw text list, shows data freshness/filters, and respects refresh interval messaging (covers FR-004, FR-007).
- [ ] T009 [P] Add Playwright e2e spec `tests/e2e/jira-active-tickets.spec.ts` covering end-to-end fetch, pagination scenarios, error banner accessibility, and aria landmarks (covers FR-004, FR-005, FR-008).

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T010 Implement TTL cache helper in `server/utilities/caching/ttl-cache.ts` with 5-minute default, jitter support, and expiry enforcement hooks (covers FR-007, FR-011).
- [ ] T011 Implement Jira OAuth client in `server/utilities/jira/client.ts` (client credentials flow, pagination batching, schema normalization, enforced JQL) (covers FR-002, FR-009, FR-010).
- [ ] T012 Implement server route `server/api/jira/active-tickets.get.ts` to return cached or fresh results using the client and data model, guaranteeing only current-user tickets and key/summary payload (covers FR-001, FR-003, FR-006, FR-008, FR-009, FR-010, FR-011).
- [ ] T013 Add structured telemetry (duration, cache status, Jira status, ticket count) and error handling within `server/api/jira/active-tickets.get.ts` (covers FR-006).
- [ ] T014 Implement composable `composables/useActiveJiraTickets.ts` handling server/client fetch, auto-refresh, stale cache invalidation, and error propagation with configurable interval (covers FR-007, FR-008).
- [ ] T015 Implement `components/ticket-list/ActiveTicketsList.vue` rendering raw text list with data freshness timestamp, filters note, loading skeleton, and empty/error states compliant with WCAG 2.2 AA (covers FR-004, FR-005, FR-008).
- [ ] T016 Implement page `pages/tickets/index.vue` wiring layout, composable usage, and accessibility hooks, including no-JS fallback (covers FR-004, FR-005).

## Phase 3.4: Integration
- [ ] T017 Integrate telemetry exporters (log pipeline/DORA dashboard hooks) in `server/utilities/telemetry.ts` to capture new fields (supports FR-006).
- [ ] T018 Wire structured logs into existing logging configuration (e.g., update `server/middleware/logging.ts`) to include Jira route events and cache metrics (supports FR-006).
- [ ] T019 Document dashboard updates and submit configuration changes in `specs/001-i-wish-to/dora-dashboard-update.md`, ensuring the DORA metrics board surfaces the new telemetry within one iteration (Operational Transparency principle).
- [ ] T020 Add release/change notes in `specs/001-i-wish-to/release-notes.md` summarizing Jira insight impact and follow-up actions for stakeholders (Operational Transparency principle).

## Phase 3.5: Polish
- [ ] T021 [P] Update `specs/001-i-wish-to/quickstart.md` with final verification steps and optional CLI examples/screenshots (reinforces FR-004, FR-005).
- [ ] T022 Verify performance budgets (<2s render, <150ms interaction) and document results in `specs/001-i-wish-to/quickstart.md` performance addendum, noting measurement tooling and outcomes (satisfies performance goal for FR-005).