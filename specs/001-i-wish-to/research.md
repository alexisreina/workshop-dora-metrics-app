# Phase 0 Research: Jira Active Ticket Listing

## Atlassian OAuth 2.0 Integration
- **Decision**: Use Atlassian OAuth 2.0 (Client Credentials) with scopes `read:jira-user` and `read:jira-work`.
- **Rationale**: Meets organizational security requirements and avoids personal tokens; supports server-to-server authentication for Nuxt backend.
- **Alternatives Considered**:
  - Personal API token (basic auth) — rejected due to weaker security posture and token rotation burden.
  - JWT (Connect app) — unnecessary complexity for read-only data fetch.

## Jira Search Endpoint Usage
- **Decision**: Call `/rest/api/3/search` with JQL `assignee = currentUser() AND statusCategory != Done`, pagination `maxResults=50`, and `startAt` batching for larger result sets.
- **Rationale**: Aligns with spec definition of active tickets and leverages Jira's standard pagination.
- **Alternatives Considered**:
  - Board/sprint-specific queries — too narrow for general active workload overview.
  - Custom fields filtering — requires additional configuration not specified.

## Caching & Rate Limiting
- **Decision**: Cache normalized results for five minutes with jitter; implement exponential backoff when Jira returns HTTP 429, and log rate-limit headers.
- **Rationale**: Balances freshness with rate-limit compliance; supports constitutional observability mandates.
- **Alternatives Considered**:
  - No caching — risks hitting rate limits and degraded responsiveness.
  - Persistent cache (Redis) — overkill for current scale; revisit if multi-instance deployment demands it.

## Accessibility & Performance Guarantees
- **Decision**: Render plain-text list with semantic markup, include loading/empty/error states, and measure render time in quickstart; enforce WCAG 2.2 AA contrast.
- **Rationale**: Upholds Accessible Insight Delivery principle and ensures inclusive interaction.
- **Alternatives Considered**:
  - Graphical components only — fails accessibility requirement for raw text listing.
  - Client-only rendering — breaks no-JS usability guarantee.

## Telemetry & Observability
- **Decision**: Emit structured logs with fields (`jiraQueryDurationMs`, `cacheStatus`, `jiraStatusCode`), hook into existing DORA dashboards, and alert on consecutive failures.
- **Rationale**: Supports Operational Transparency principle and facilitates rapid incident detection.
- **Alternatives Considered**:
  - Minimal console logging — insufficient for compliance and monitoring.

---
Prepared: 2025-10-01
