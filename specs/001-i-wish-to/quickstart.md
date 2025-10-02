# Quickstart: Jira Active Ticket Listing

## Prerequisites
- Jira Cloud site URL, client ID, and client secret with scopes `read:jira-user` and `read:jira-work`.
- `.env` entries configured:
  - `JIRA_BASE_URL`
  - `JIRA_CLIENT_ID`
  - `JIRA_CLIENT_SECRET`
- Development server running (`npm run dev`).

## Steps
1. **Start the app**: `npm run dev` (ensure Nuxt server API is available).
2. **Seed cache (optional)**: Call `GET http://localhost:3000/api/jira/active-tickets` to populate cache; confirm 200 response with `source: "jira-live"`.
3. **Open UI**: Navigate to `http://localhost:3000/tickets`.
4. **Verify render**: Page lists tickets as `KEY - Summary` and shows loading skeleton before data arrives.
5. **Check empty state**: Temporarily adjust JQL to return zero results; page should display empty message and 200 response with empty list.
6. **Exercise error state**: Revoke credentials or stop network; ensure UI surfaces error banner and logs capture failure.
7. **Telemetry**: Inspect logs (server console or configured logger) for `jiraQueryDurationMs`, `cacheStatus`, and rate-limit information.
8. **Accessibility**: Use keyboard navigation and screen reader to confirm text is accessible; ensure focus order matches expectations.

## Expected Results
- First API call hits Jira and caches result; subsequent requests within 5 minutes use cache (`source: "jira-cache"`).
- Tickets render within 2 seconds and match JQL filter for current user.
- Logs capture success/failure with structured fields.
- Error and empty states are accessible and informative.

---
Prepared: 2025-10-01
