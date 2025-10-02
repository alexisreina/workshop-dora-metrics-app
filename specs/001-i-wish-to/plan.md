
# Implementation Plan: Jira Active Ticket Listing

**Branch**: `001-i-wish-to` | **Date**: 2025-10-01 | **Spec**: C:/GIT/workshop-dora-metrics-app/specs/001-i-wish-to/spec.md  
**Input**: Feature specification from C:/GIT/workshop-dora-metrics-app/specs/001-i-wish-to/spec.md

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

## Summary
Expose a Nuxt server endpoint that authenticates to Jira Cloud via OAuth 2.0, queries active tickets with `assignee = currentUser() AND statusCategory != Done`, caches responses for five minutes, and renders the ticket list as accessible raw text on a new dashboard page with full telemetry and failing tests prepared first.

## Technical Context
**Language/Version**: TypeScript (Nuxt 4.1.2 runtime)  
**Primary Dependencies**: Nuxt 4, PrimeVue 4, @frontiers/prime-preset, ofetch/$fetch, Atlassian Jira REST API (OAuth 2.0)  
**Storage**: N/A (ephemeral in-memory cache scoped to server runtime)  
**Testing**: Vitest with @nuxt/test-utils, Playwright (or Nuxt bridge) for end-to-end flows, MSW for contract simulation  
**Target Platform**: Web (SSR-rendered Nuxt application)  
**Project Type**: single  
**Performance Goals**: Active tickets view renders ≤2s FCP and ≤150ms post-refresh latency; Jira fetch completes within 1s P95 under normal load  
**Constraints**: OAuth 2.0 client credentials stored in runtime config; cache TTL 5 minutes; respect Jira rate limits (HTTP 429 backoff)  
**Scale/Scope**: Single Jira site, up to ~200 active tickets per user per request window

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Metric Integrity First**: Jira REST `search` endpoint is the authoritative data source. Validate every issue contains `key` and `summary`; reject null fields; add unit tests covering transformation. Capture fetch/playback telemetry to detect drift.
- **Accessible Insight Delivery**: Present tickets as semantic text list with skip links, ensure color contrast via existing typography tokens, add loading/empty/error states with screen reader copy, and measure render timing in quickstart.
- **Test-Led Iteration**: Author failing tests first: server handler unit (401/429/caching), contract tests for API response schema, component test for list rendering, and Playwright flow verifying text format.
- **Operational Transparency**: Emit structured logs for request duration, cache hits, and Jira status codes; tag telemetry for DORA dashboards; configure alerts when consecutive failures exceed threshold.
- **Deliberate Simplicity & Reuse**: Reuse shared layout/typography components, centralize Jira configuration in runtime config helper, leverage Nuxt server route ($fetch) without bespoke frameworks, and remove obsolete code paths during rollout.

## Project Structure

### Documentation (this feature)
```
specs/001-i-wish-to/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── active-tickets.openapi.json
```

### Source Code (repository root)
```
app/
  app.vue
components/
  ticket-list/
    ActiveTicketsList.vue
composables/
  useActiveJiraTickets.ts
pages/
  tickets/
    index.vue
server/
  api/
    jira/
      active-tickets.get.ts
  utilities/
    jira/
      client.ts
    caching/
      ttl-cache.ts
tests/
  unit/
    server/api/jira/active-tickets.spec.ts
    components/ActiveTicketsList.spec.ts
  integration/
    pages/tickets-page.spec.ts
  e2e/
    jira-active-tickets.spec.ts
```

**Structure Decision**: Single Nuxt project; server route under `server/api/jira/active-tickets.get.ts`, composable for frontend consumption, and dedicated ticket list component with accompanying unit, integration, and e2e tests.

## Phase 0: Outline & Research
1. Validated Atlassian OAuth 2.0 client credentials flow for server-to-server integrations; documented token exchange, scopes (`read:jira-user`, `read:jira-work`), and secure storage requirements.  
2. Analyzed Jira search endpoint query parameters for active ticket filtering and pagination (max 50 per call); derived batching strategy for >50 issues.  
3. Defined caching and rate-limit mitigation: 5-minute TTL cache with jitter, exponential backoff on 429, and telemetry fields for monitoring.  
4. Captured accessibility and performance expectations to guide component design (loading skeleton, focus management, raw text rendering).

**Output**: research.md captures decisions, rationales, and alternatives.

## Phase 1: Design & Contracts
1. Data model defined in data-model.md: `JiraIssueSummary`, `JiraTicketListResult`, `JiraClientConfig`, cache entry structure with timestamps and token metadata.  
2. API contract (`contracts/active-tickets.openapi.json`) specifies `GET /api/jira/active-tickets` response schema, error formats (401/429/500), and caching headers.  
3. Design Nuxt server handler flow: load config, refresh OAuth token if stale, fetch Jira issues with pagination, normalize fields, cache result, emit telemetry, and return minimal payload.  
4. Frontend interaction: `useActiveJiraTickets` composable to call server API (server-side + client refresh), fallback states (loading, empty, error), accessible raw text rendering via `ActiveTicketsList` component.  
5. Testing plan: Vitest unit tests for client/token lifecycle and cache; component tests verifying rendering and accessibility attributes; Playwright scenario covering actual page.  
6. Observability: integrate server logs with structured fields (`jiraQueryDurationMs`, `cacheStatus`), and plan for dashboard update referencing DORA metrics once telemetry ingested.

**Outputs**: data-model.md, contracts/active-tickets.openapi.json, quickstart.md, plus updated plan.

## Phase 2: Task Planning Approach
- Use Phase 1 artifacts to enumerate tasks: configure environment variables, build server client, construct component/composable, instrumentation, and tests.  
- Categorize tasks by setup, tests (contract/unit/component/e2e), implementation (server/composable/component), instrumentation, accessibility verification, and cleanup.  
- Enforce TDD ordering: write failing tests (API contract fixture, unit handler, component) before server/component implementation.  
- Maintain parallel markers for independent files (e.g., component vs. server) while keeping shared modules sequential.  
- Ensure tasks call out telemetry updates and documentation (quickstart + README note if required).

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
No constitutional deviations identified; table intentionally left empty.

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
