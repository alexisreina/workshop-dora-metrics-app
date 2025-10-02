# Tasks: Support "Change Failure Rate" DORA Metric

**Input**: Design documents from `/specs/008-support-change-failure/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: Nuxt 4, Vue 3 Composition API, PrimeVue, TypeScript
2. Load design documents:
   → data-model.md: 5 entities → model tasks
   → contracts/change-failure-rate-api.yaml: 3 endpoints → contract test tasks
   → quickstart.md: 7 scenarios → integration test tasks
3. Generate tasks by category:
   → Setup: TypeScript types, dependencies
   → Tests: contract tests, integration tests
   → Core: API endpoints, composables, components
   → Integration: navigation, routing, error handling
   → Polish: unit tests, performance validation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Nuxt 4 web app**: `app/` for frontend, `app/server/api/` for backend
- **Tests**: `tests/contract/`, `tests/integration/`, `tests/unit/`
- Paths follow existing Nuxt 4 atomic design structure

## Phase 3.1: Setup
- [ ] T001 [P] Create TypeScript interfaces for ChangeFailureRateMetric in `app/types/metrics.ts`
- [ ] T002 [P] Create TypeScript interfaces for DeploymentRecord in `app/types/deployment.ts`
- [ ] T003 [P] Create TypeScript interfaces for FailureEvent in `app/types/failure.ts`
- [ ] T004 [P] Create TypeScript interfaces for TimePeriod and BenchmarkData in `app/types/common.ts`
- [ ] T005 [P] Create TypeScript enums for all status types in `app/types/enums.ts`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test GET /api/metrics/change-failure-rate/ in `tests/contract/test_change_failure_rate_current.ts`
- [ ] T007 [P] Contract test GET /api/metrics/change-failure-rate/historical in `tests/contract/test_change_failure_rate_historical.ts`
- [ ] T008 [P] Contract test GET /api/metrics/change-failure-rate/benchmarks in `tests/contract/test_change_failure_rate_benchmarks.ts`
- [ ] T009 [P] Integration test "View Current Change Failure Rate" scenario in `tests/integration/test_cfr_current_view.ts`
- [ ] T010 [P] Integration test "View Historical Trends" scenario in `tests/integration/test_cfr_historical_trends.ts`
- [ ] T011 [P] Integration test "Filter by Time Period" scenario in `tests/integration/test_cfr_time_filtering.ts`
- [ ] T012 [P] Integration test "Compare Against Benchmarks" scenario in `tests/integration/test_cfr_benchmarks.ts`
- [ ] T013 [P] Integration test "Navigate from Main Dashboard" scenario in `tests/integration/test_cfr_navigation.ts`
- [ ] T014 [P] Integration test "Handle No Data State" scenario in `tests/integration/test_cfr_no_data.ts`
- [ ] T015 [P] Integration test "Handle Error States" scenario in `tests/integration/test_cfr_error_states.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)
### API Endpoints
- [ ] T016 Implement GET /api/metrics/change-failure-rate/ endpoint in `app/server/api/metrics/change-failure-rate/index.get.ts`
- [ ] T017 Implement GET /api/metrics/change-failure-rate/historical endpoint in `app/server/api/metrics/change-failure-rate/historical.get.ts`
- [ ] T018 Implement GET /api/metrics/change-failure-rate/benchmarks endpoint in `app/server/api/metrics/change-failure-rate/benchmarks.get.ts`
- [ ] T019 [P] Create mock deployment data generator in `app/server/utils/mockDeploymentData.ts`
- [ ] T020 [P] Create mock failure events generator in `app/server/utils/mockFailureData.ts`
- [ ] T021 [P] Create benchmark data constants in `app/server/utils/benchmarkData.ts`

### Composables
- [ ] T022 [P] Create useChangeFailureRate composable in `app/composables/useChangeFailureRate.ts`
- [ ] T023 [P] Create useTimeFiltering composable in `app/composables/useTimeFiltering.ts`
- [ ] T024 [P] Create useBenchmarkComparison composable in `app/composables/useBenchmarkComparison.ts`

### Atomic Design Components
#### Atoms
- [ ] T025 [P] Create MetricValue atom component in `app/components/atoms/MetricValue.vue`
- [ ] T026 [P] Create BenchmarkIndicator atom component in `app/components/atoms/BenchmarkIndicator.vue`
- [ ] T027 [P] Create TimeFilter atom component in `app/components/atoms/TimeFilter.vue`

#### Molecules
- [ ] T028 [P] Create MetricCard molecule component in `app/components/molecules/MetricCard.vue`
- [ ] T029 [P] Create TrendChart molecule component in `app/components/molecules/TrendChart.vue`
- [ ] T030 [P] Create FilterBar molecule component in `app/components/molecules/FilterBar.vue`

#### Organisms
- [ ] T031 Create ChangeFailureRateSection organism component in `app/components/organisms/ChangeFailureRateSection.vue`

### Pages
- [ ] T032 Create Change Failure Rate page in `app/pages/metrics/change-failure-rate.vue`

## Phase 3.4: Integration
- [ ] T033 Add Change Failure Rate navigation item to existing navigation system in `app/server/api/navigation/index.get.ts`
- [ ] T034 Update navigation types to include CFR route in `app/types/navigation.ts`
- [ ] T035 Add error handling and loading states to CFR page
- [ ] T036 Implement data validation and error boundaries
- [ ] T037 Add performance optimizations (lazy loading, caching)

## Phase 3.5: Polish
- [ ] T038 [P] Unit tests for useChangeFailureRate composable in `tests/unit/composables/useChangeFailureRate.test.ts`
- [ ] T039 [P] Unit tests for useTimeFiltering composable in `tests/unit/composables/useTimeFiltering.test.ts`
- [ ] T040 [P] Unit tests for useBenchmarkComparison composable in `tests/unit/composables/useBenchmarkComparison.test.ts`
- [ ] T041 [P] Unit tests for MetricValue component in `tests/unit/components/atoms/MetricValue.test.ts`
- [ ] T042 [P] Unit tests for BenchmarkIndicator component in `tests/unit/components/atoms/BenchmarkIndicator.test.ts`
- [ ] T043 [P] Unit tests for TimeFilter component in `tests/unit/components/atoms/TimeFilter.test.ts`
- [ ] T044 [P] Unit tests for MetricCard component in `tests/unit/components/molecules/MetricCard.test.ts`
- [ ] T045 [P] Unit tests for TrendChart component in `tests/unit/components/molecules/TrendChart.test.ts`
- [ ] T046 [P] Unit tests for FilterBar component in `tests/unit/components/molecules/FilterBar.test.ts`
- [ ] T047 [P] Unit tests for ChangeFailureRateSection component in `tests/unit/components/organisms/ChangeFailureRateSection.test.ts`
- [ ] T048 Performance tests - validate <200ms page load requirement
- [ ] T049 Accessibility validation - screen reader and keyboard navigation
- [ ] T050 Execute quickstart.md validation scenarios manually
- [ ] T051 Code formatting and linting cleanup
- [ ] T052 Remove any temporary files or debugging code

## Dependencies
- **Setup before Tests**: T001-T005 must complete before T006-T015
- **Tests before Implementation**: T006-T015 must complete and FAIL before T016-T032
- **API before Composables**: T016-T021 before T022-T024
- **Composables before Components**: T022-T024 before T025-T031
- **Components before Page**: T025-T031 before T032
- **Core before Integration**: T016-T032 before T033-T037
- **Implementation before Polish**: T016-T037 before T038-T052

## Parallel Example
```
# Launch T001-T005 together (Setup phase):
Task: "Create TypeScript interfaces for ChangeFailureRateMetric in app/types/metrics.ts"
Task: "Create TypeScript interfaces for DeploymentRecord in app/types/deployment.ts"
Task: "Create TypeScript interfaces for FailureEvent in app/types/failure.ts"
Task: "Create TypeScript interfaces for TimePeriod and BenchmarkData in app/types/common.ts"
Task: "Create TypeScript enums for all status types in app/types/enums.ts"

# Launch T006-T015 together (Contract and Integration tests):
Task: "Contract test GET /api/metrics/change-failure-rate/ in tests/contract/test_change_failure_rate_current.ts"
Task: "Contract test GET /api/metrics/change-failure-rate/historical in tests/contract/test_change_failure_rate_historical.ts"
Task: "Contract test GET /api/metrics/change-failure-rate/benchmarks in tests/contract/test_change_failure_rate_benchmarks.ts"
Task: "Integration test View Current Change Failure Rate scenario in tests/integration/test_cfr_current_view.ts"
[... and so on for all test tasks]

# Launch T025-T027 together (Atom components):
Task: "Create MetricValue atom component in app/components/atoms/MetricValue.vue"
Task: "Create BenchmarkIndicator atom component in app/components/atoms/BenchmarkIndicator.vue"
Task: "Create TimeFilter atom component in app/components/atoms/TimeFilter.vue"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing (TDD approach)
- Commit after each task completion
- Follow existing atomic design patterns
- Use Vue 3 Composition API with `<script setup>` syntax
- Integrate with existing PrimeVue components
- Maintain TypeScript strict mode compliance

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - change-failure-rate-api.yaml → 3 contract test tasks [P]
   - Each endpoint → corresponding implementation task
   
2. **From Data Model**:
   - 5 entities → 5 TypeScript interface tasks [P]
   - Enums → 1 enum definition task [P]
   
3. **From User Stories**:
   - 7 quickstart scenarios → 7 integration test tasks [P]
   - Each scenario → validation task in polish phase

4. **Ordering**:
   - Setup → Tests → API → Composables → Components → Page → Integration → Polish
   - Dependencies block parallel execution within phases

## Validation Checklist
*GATE: Checked before task execution*

- [x] All 3 contracts have corresponding tests (T006-T008)
- [x] All 5 entities have TypeScript interface tasks (T001-T005)
- [x] All tests come before implementation (T006-T015 before T016+)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] TDD approach maintained (tests fail first)
- [x] Atomic design pattern followed
- [x] Integration with existing navigation system planned
