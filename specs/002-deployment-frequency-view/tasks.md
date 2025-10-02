# Tasks: Deployment Frequency View

**Input**: Design documents from `C:\Repo\workshop-dora-metrics-app\specs\002-deployment-frequency-view\`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no direct dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup
- [ ] T001 Verify Nuxt setup and enable PrimeVue and Tailwind in `nuxt.config.ts`
- [ ] T002 Install UI and chart deps: `primevue`, `primeicons`, `@primevue/nuxt-module`, `chart.js`, `tailwindcss`, `postcss`, `autoprefixer`
- [ ] T003 [P] Initialize Tailwind config and base CSS in `app/assets/css/main.css`
- [ ] T004 [P] Configure PrimeVue (theme, icons) per constitution in `nuxt.config.ts`
- [ ] T005 Add ESLint/Prettier/TypeScript configs (or verify) at repo root

## Phase 3.2: Tests First (TDD)
### Contract tests from `/contracts/openapi.yaml`
- [ ] T006 [P] Contract test GET /api/df/series → `tests/contract/df.series.get.spec.ts`
- [ ] T007 [P] Contract test GET /api/df/summary → `tests/contract/df.summary.get.spec.ts`
- [ ] T008 [P] Contract test GET /api/df/events → `tests/contract/df.events.get.spec.ts`

### Integration tests from user stories / quickstart
- [ ] T009 [P] Default load (6m, day) shows chart, summary, table deterministic → `tests/integration/df.default.spec.ts`
- [ ] T010 [P] Grouping labels (day `yyyy-mm-dd`, week ISO `yyyy-Www`, month `yyyy-mm`) → `tests/integration/df.grouping-labels.spec.ts`
- [ ] T011 [P] Rolling average day-only; partial-window <7 days → `tests/integration/df.rolling-average.spec.ts`
- [ ] T012 [P] Filters: DF counts only exact `prod`/`production` (case-insensitive) → `tests/integration/df.filters-production.spec.ts`
- [ ] T013 [P] Summary includes delta and percent vs previous period → `tests/integration/df.summary-deltas.spec.ts`

### Unit tests for core logic
- [ ] T014 [P] Fake data generator respects seed, 08:00–20:00 window, weekday/weekend distribution → `tests/unit/df/fakeDataGenerator.test.ts`
- [ ] T015 [P] ISO-8601 week bucketing (Mon start, year boundary) → `tests/unit/df/bucketing.week.test.ts`
- [ ] T016 [P] Day/month bucketing local-timezone correctness & DST → `tests/unit/df/bucketing.day-month.test.ts`
- [ ] T017 [P] 7-day rolling average including partial-window behavior → `tests/unit/df/rolling-average.test.ts`
- [ ] T018 [P] Production matching exact-only (`prod`|`production`) → `tests/unit/df/production-matching.test.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)
### Types and utilities
- [ ] T019 [P] Create DF types per data model → `app/utils/df/types.ts`
- [ ] T020 [P] Implement date helpers: local tz, ISO week labels, bucketing → `app/utils/df/dateHelpers.ts`
- [ ] T021 [P] Implement rolling average util (7-day, partial-window) → `app/utils/df/rollingAverage.ts`

### Fake data and repository (deterministic, in-memory)
- [ ] T022 Seeded fake data generator (Tue–Thu higher, weekends lower, bursts, 10–15% failures; prod higher success) → `app/utils/df/fakeData.ts`
- [ ] T023 In-memory dataset bootstrap on server init (default 6 months) → `app/server/api/df/data.store.ts`
- [ ] T024 Filtering helpers for project/repository/environment (static lists) → `app/utils/df/filters.ts`

### Aggregation services
- [ ] T025 Series aggregator (groupBy day/week/month, production-only successes, labels) → `app/server/api/df/services/series.service.ts`
- [ ] T026 Summary calculator (totals, average per bucket, previous-period delta/percent) → `app/server/api/df/services/summary.service.ts`
- [ ] T027 Events provider (raw events, includes non-Production) → `app/server/api/df/services/events.service.ts`

### API endpoints (facade; no external calls)
- [ ] T028 GET /api/df/series → `app/server/api/df/series.get.ts`
- [ ] T029 GET /api/df/summary → `app/server/api/df/summary.get.ts`
- [ ] T030 GET /api/df/events → `app/server/api/df/events.get.ts`

### Composables
- [ ] T031 [P] `useDeploymentFrequency` composable (fetch series, summary, events) → `app/composables/df/useDeploymentFrequency.ts`
- [ ] T032 [P] Selection state composable (presets, custom range, grouping, filters, rolling toggle) → `app/composables/df/useDfSelection.ts`

### UI Components
- [ ] T033 [P] Filters panel (Project/Repository/Environment) with static lists → `app/components/df/DFFilters.vue`
- [ ] T034 [P] Chart organism (PrimeVue Chart + rolling avg overlay) → `app/components/df/DFChart.vue`
- [ ] T035 [P] Summary panel (total, average, delta, percent) → `app/components/df/DFSummary.vue`
- [ ] T036 [P] Events table (raw events incl. non-Prod) → `app/components/df/DFEventsTable.vue`

### Page wiring
- [ ] T037 DF page route → `app/pages/df.vue` (layout, state wiring, components)

## Phase 3.4: Integration & Polish
- [ ] T038 Loading/empty/error states for chart, summary, table (local-only)
- [ ] T039 [P] Accessibility: labels, table semantics, color contrast
- [ ] T040 [P] Performance: ensure DF view renders <200ms with 6m data
- [ ] T041 [P] Update `quickstart.md` with any UI nuances
- [ ] T042 Lint/format, ensure ESLint/Prettier pass

## Dependencies
- Setup (T001–T005) before all tests and implementation
- Contract tests (T006–T008) and integration/unit tests (T009–T018) before corresponding implementation tasks
- Types/utils (T019–T021) before generator/aggregators/endpoints (T022–T030)
- Generator and data store (T022–T023) before services (T025–T027)
- Services (T025–T027) before API endpoints (T028–T030)
- API endpoints before composables (T031–T032) and UI (T033–T037)
- Polish (T038–T042) last

## Parallel Execution Examples
```
# Run contract tests in parallel
Task: "Contract test GET /api/df/series → tests/contract/df.series.get.spec.ts"
Task: "Contract test GET /api/df/summary → tests/contract/df.summary.get.spec.ts"
Task: "Contract test GET /api/df/events → tests/contract/df.events.get.spec.ts"

# Run unit tests in parallel
Task: "Fake data generator tests → tests/unit/df/fakeDataGenerator.test.ts"
Task: "ISO week bucketing tests → tests/unit/df/bucketing.week.test.ts"
Task: "Rolling average tests → tests/unit/df/rolling-average.test.ts"
Task: "Production matching tests → tests/unit/df/production-matching.test.ts"
```

## Validation Checklist
- [ ] All contracts have corresponding tests (T006–T008)
- [ ] All entities have model/types tasks (T019)
- [ ] All tests precede implementation
- [ ] [P] tasks are independent file paths
- [ ] Each task specifies an exact file path
