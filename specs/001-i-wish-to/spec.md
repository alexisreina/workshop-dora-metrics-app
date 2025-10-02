# Feature Specification: Jira Active Ticket Listing

**Feature Branch**: `001-i-wish-to`  
**Created**: 2025-10-01  
**Status**: Draft  
**Input**: User description: "I wish to create a backend request to JIRA to obtain my currently active Jira tickets and a frontend page that will list them. I want it to be listed as raw text with the Jira Ticket code and the Summary of the ticket. Also, I am unaware of what is needed to connect to Jira, investigate that and inform me how to do it"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## Clarifications

### Session 2025-10-01
- Q: How should the app authenticate against Jira Cloud when fetching tickets? → A: OAuth 2.0 integration using Atlassian Connect
- Q: How should “active” Jira tickets be filtered? → A: `assignee = currentUser() AND statusCategory != Done`
- Q: How often should we refresh Jira data before showing it to the user? → A: Every 5 minutes, cached between refreshes

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a developer monitoring my work, I want the Dora Metrics app to show my currently active Jira tickets so I can review them quickly without leaving the dashboard.

### Acceptance Scenarios
1. **Given** the Jira connection is configured and the user has active tickets, **When** the user opens the Active Jira Tickets view, **Then** the page displays each ticket as `ISSUE-KEY - Summary` in raw text.
2. **Given** the Jira API returns no active tickets for the user, **When** the view loads, **Then** the page presents an empty-state message explaining that there are no active tickets.
3. **Given** the Jira API call fails due to authentication or network issues, **When** the view loads, **Then** the user sees an error notification and no outdated ticket data.

### Edge Cases
- What happens when Jira returns more tickets than the page can display at once (pagination or load-more)?
- How does the system behave when Jira rate limits or returns partial failures?
- What should be displayed if a ticket lacks a summary or has formatting that breaks raw text output?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST retrieve the authenticated user’s active Jira tickets using the Jira REST API.
- **FR-002**: System MUST authenticate to Jira via OAuth 2.0 (Atlassian Connect) with client credentials stored outside source control.
- **FR-003**: System MUST expose a backend endpoint that returns each ticket’s issue key and summary in responses.
- **FR-004**: Frontend MUST render the list of tickets as raw text lines in the format `ISSUE-KEY - Summary`.
- **FR-005**: Frontend MUST meet accessibility requirements (keyboard navigable, WCAG 2.2 AA contrast) and remain usable if JavaScript enhancements fail.
- **FR-006**: System MUST log API calls, including success/failure status, latency, and rate-limit headers, to the shared telemetry pipeline.
- **FR-007**: System MUST refresh data on a configurable interval to keep displayed tickets current without violating Jira rate limits.
- **FR-008**: System MUST provide user-facing feedback when Jira is unreachable or credentials are invalid.
- **FR-009**: System MUST validate that only tickets assigned to the current authenticated user are shown.
- **FR-010**: System MUST query Jira using the JQL `assignee = currentUser() AND statusCategory != Done` to define active tickets.
- **FR-011**: System MUST cache Jira results for up to 5 minutes and refresh automatically when the cache expires.

### Key Entities *(include if feature involves data)*
- **JiraIssueSummary**: Represents a single ticket with fields `{ key, summary }` returned to the frontend.
- **JiraConnectionConfig**: Holds Jira site URL, OAuth 2.0 client credentials (client ID, secret, scopes), and refresh interval settings managed via secured configuration.

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed
