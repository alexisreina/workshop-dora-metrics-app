# Data Model: Jira Active Ticket Listing

## Entities

### JiraIssueSummary
- **Description**: Normalized subset of Jira issue fields needed for frontend display.
- **Fields**:
  - `key`: string (e.g., `PROJ-123`)
  - `summary`: string
  - `status`: string (`To Do`, `In Progress`, etc.)
  - `updatedAt`: string (ISO timestamp)
- **Constraints**:
  - `key` MUST be present; handler rejects entries missing this field.
  - `summary` MUST be non-empty; fallback text logged as warning.

### JiraTicketListResult
- **Description**: Server response structure for `/api/jira/active-tickets`.
- **Fields**:
  - `tickets`: JiraIssueSummary[] (maximum 200 entries per refresh)
  - `fetchedAt`: string (ISO timestamp of cache generation)
  - `cacheTtlSeconds`: number (typically 300)
  - `source`: string (e.g., `jira-cache`, `jira-live`)
- **Constraints**:
  - `tickets` array MUST maintain insertion order from Jira response.
  - `source` indicates whether data came from cache or fresh fetch.

### JiraClientConfig
- **Description**: Configuration object for Jira OAuth and query behavior.
- **Fields**:
  - `baseUrl`: string (e.g., `https://example.atlassian.net`)
  - `clientId`: string
  - `clientSecret`: string
  - `scopes`: string[] (`read:jira-user`, `read:jira-work`)
  - `refreshIntervalMs`: number (300000 default)
  - `maxResults`: number (50 default)
- **Constraints**:
  - Secrets stored in runtime config, never committed.
  - `refreshIntervalMs` MUST be ≥ 60000 to respect rate limit.

### JiraCacheEntry
- **Description**: Internal structure stored in in-memory cache.
- **Fields**:
  - `expiresAt`: number (epoch millis)
  - `data`: JiraTicketListResult
  - `token`: JiraOAuthToken (optional, for reuse)
- **Constraints**:
  - Cache invalidated if current time ≥ `expiresAt`.

### JiraOAuthToken
- **Description**: Result of Atlassian client credentials exchange.
- **Fields**:
  - `value`: string (bearer token)
  - `expiresAt`: number (epoch millis)
  - `scope`: string
- **Constraints**:
  - Token refreshed when remaining lifetime < 60 seconds.

## Relationships & Interactions
- `JiraTicketListResult.tickets` references many `JiraIssueSummary` entries.
- `JiraCacheEntry.data` embeds a `JiraTicketListResult`.
- `JiraClientConfig` guides OAuth token generation and search pagination.

## Validation Rules
- When transforming Jira REST payload, ignore issues lacking `fields.summary` or `fields.status`; log and continue.
- If Jira returns >50 issues, issue multiple search calls with incremented `startAt` until hits coverage or 200 cap.
- If cache fetch fails, fall back to fresh Jira call and reset cache.

## State Transitions
1. **Cache Miss** → Fetch token → Call Jira search → Normalize response → Store `JiraCacheEntry`.
2. **Cache Hit (Fresh)** → Return cached `JiraTicketListResult` immediately.
3. **Cache Expired** → Remove entry → Execute flow as cache miss.
4. **Token Expiring** → Refresh token before next Jira request.

---
Prepared: 2025-10-01
