# Tasks: Build a top bar with the app name and a sidebar where we can place internal navigation to the different metrics, for the index page build just a welcome page with some description of what the app is about

**Input**: Design documents from `/specs/001-build-a-top/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Nuxt 4 Full-Stack**: `app/`, `src/`, `tests/` at repository root
- **Components**: `app/components/` (atoms, molecules, organisms, templates)
- **Pages**: `app/pages/` for file-based routing
- **Composables**: `app/composables/` for shared logic
- **Server**: `app/server/` for API routes and middleware
- Paths shown below assume Nuxt 4 structure - adjust based on plan.md structure

## Phase 3.1: Setup

- [x] T001 Create Nuxt 4 project structure per implementation plan
- [x] T002 Initialize Nuxt 4 project with Vue 3, PrimeVue, and Tailwind CSS dependencies
- [x] T003 [P] Configure ESLint, Prettier, and TypeScript
- [x] T004 [P] Setup PrimeVue module configuration in nuxt.config.ts
- [x] T005 [P] Configure Tailwind CSS with PrimeVue integration

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T006 [P] Contract test for navigation API in tests/contract/test_navigation_api.ts
- [x] T007 [P] Component test for TopBar component in tests/unit/components/TopBar.test.ts
- [x] T008 [P] Component test for Sidebar component in tests/unit/components/Sidebar.test.ts
- [x] T009 [P] Component test for NavigationLayout component in tests/unit/components/NavigationLayout.test.ts
- [x] T010 [P] Integration test for desktop navigation flow in tests/integration/test_desktop_navigation.ts
- [x] T011 [P] Integration test for mobile navigation flow in tests/integration/test_mobile_navigation.ts
- [x] T012 [P] Integration test for responsive behavior in tests/integration/test_responsive_navigation.ts
- [x] T013 [P] E2E test for complete navigation user journey in tests/e2e/navigation.spec.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] T014 [P] NavigationItem type definition in app/types/navigation.ts
- [x] T015 [P] AppBranding type definition in app/types/branding.ts
- [x] T016 [P] WelcomeContent type definition in app/types/content.ts
- [x] T017 [P] useNavigation composable with TypeScript interfaces in app/composables/useNavigation.ts
- [x] T018 [P] useMobile composable with TypeScript interfaces in app/composables/useMobile.ts
- [x] T019 [P] AppLogo atom component using <script setup> syntax in app/components/atoms/AppLogo.vue
- [x] T020 [P] NavigationItem atom component using <script setup> syntax in app/components/atoms/NavigationItem.vue
- [x] T021 [P] TopBar molecule component using <script setup> syntax in app/components/molecules/TopBar.vue
- [x] T022 [P] Sidebar molecule component using <script setup> syntax in app/components/molecules/Sidebar.vue
- [x] T023 [P] NavigationLayout organism component using <script setup> syntax in app/components/organisms/NavigationLayout.vue
- [x] T024 [P] DefaultLayout template component using <script setup> syntax in app/components/templates/DefaultLayout.vue
- [x] T025 [P] Welcome page using <script setup> syntax in app/pages/index.vue
- [x] T026 [P] Metrics placeholder pages using <script setup> syntax in app/pages/metrics/[slug].vue
- [x] T027 Navigation API endpoint in app/server/api/navigation/index.get.ts
- [x] T028 Navigation state API endpoint in app/server/api/navigation/state.post.ts

## Phase 3.4: Integration

- [ ] T029 Connect navigation state management to Vue router
- [ ] T030 Implement mobile breakpoint detection middleware
- [ ] T031 Add navigation middleware in app/middleware/navigation.global.ts
- [ ] T032 Configure PrimeVue theme with @frontiers/prime-preset
- [ ] T033 Implement Tailwind CSS responsive design classes
- [ ] T034 Add accessibility features (ARIA labels, keyboard navigation)
- [ ] T035 Implement smooth transitions and animations
- [ ] T036 Add error handling for navigation failures
- [ ] T048 [P] Implement mobile hamburger menu toggle functionality
- [ ] T049 [P] Add mobile sidebar close on navigation click
- [ ] T050 [P] Implement vertical scrolling for sidebar overflow
- [ ] T051 [P] Add background color highlighting for active navigation items
- [ ] T052 Implement notification system for non-existent navigation items with message "This section is coming soon. You've been redirected to the welcome page."

## Phase 3.5: Polish

- [ ] T037 [P] Unit tests for useNavigation composable in tests/unit/composables/useNavigation.test.ts
- [ ] T038 [P] Unit tests for useMobile composable in tests/unit/composables/useMobile.test.ts
- [ ] T039 [P] Component tests for all atom components in tests/unit/components/atoms/
- [ ] T040 [P] Component tests for all molecule components in tests/unit/components/molecules/
- [ ] T041 [P] Component tests for organism components in tests/unit/components/organisms/
- [x] T042 Performance testing (<100ms navigation transitions, <2s initial load)
- [ ] T053 [P] Optimize component rendering for mobile devices
- [ ] T054 [P] Implement lazy loading for navigation components
- [ ] T055 Performance benchmarking and optimization for navigation animations
- [ ] T043 [P] Update documentation in README.md
- [ ] T044 [P] Remove code duplication and optimize imports
- [ ] T045 Accessibility testing and WCAG 2.1 compliance validation
- [ ] T046 Run manual testing scenarios from quickstart.md
- [ ] T047 [P] Update agent context files

## Dependencies

- Tests (T006-T013) before implementation (T014-T028)
- T014-T016 (type definitions) before T017-T018 (composables)
- T017-T018 (composables) before T019-T024 (components)
- T019-T024 (components) before T025-T026 (pages)
- T025-T026 (pages) before T027-T028 (API endpoints)
- T027-T028 (API endpoints) before T029-T036 (integration)
- T036 (error handling) before T048-T052 (mobile-specific features)
- T048-T052 (mobile features) before T037-T047 (polish)
- T053-T055 (performance optimization) after T042 (performance testing)
- Integration before polish (T037-T047, T053-T055)

## Parallel Example

```
# Launch T006-T013 together (all tests):
Task: "Contract test for navigation API in tests/contract/test_navigation_api.ts"
Task: "Component test for TopBar component in tests/unit/components/TopBar.test.ts"
Task: "Component test for Sidebar component in tests/unit/components/Sidebar.test.ts"
Task: "Component test for NavigationLayout component in tests/unit/components/NavigationLayout.test.ts"
Task: "Integration test for desktop navigation flow in tests/integration/test_desktop_navigation.ts"
Task: "Integration test for mobile navigation flow in tests/integration/test_mobile_navigation.ts"
Task: "Integration test for responsive behavior in tests/integration/test_responsive_navigation.ts"
Task: "E2E test for complete navigation user journey in tests/e2e/navigation.spec.ts"

# Launch T014-T016 together (type definitions):
Task: "NavigationItem type definition in app/types/navigation.ts"
Task: "AppBranding type definition in app/types/branding.ts"
Task: "WelcomeContent type definition in app/types/content.ts"

# Launch T017-T018 together (composables):
Task: "useNavigation composable with TypeScript interfaces in app/composables/useNavigation.ts"
Task: "useMobile composable with TypeScript interfaces in app/composables/useMobile.ts"

# Launch T019-T024 together (components):
Task: "AppLogo atom component using <script setup> syntax in app/components/atoms/AppLogo.vue"
Task: "NavigationItem atom component using <script setup> syntax in app/components/atoms/NavigationItem.vue"
Task: "TopBar molecule component using <script setup> syntax in app/components/molecules/TopBar.vue"
Task: "Sidebar molecule component using <script setup> syntax in app/components/molecules/Sidebar.vue"
Task: "NavigationLayout organism component using <script setup> syntax in app/components/organisms/NavigationLayout.vue"
Task: "DefaultLayout template component using <script setup> syntax in app/components/templates/DefaultLayout.vue"

# Launch T048-T051 together (mobile-specific features):
Task: "Implement mobile hamburger menu toggle functionality"
Task: "Add mobile sidebar close on navigation click"
Task: "Implement vertical scrolling for sidebar overflow"
Task: "Add background color highlighting for active navigation items"

# Launch T053-T054 together (performance optimization):
Task: "Optimize component rendering for mobile devices"
Task: "Implement lazy loading for navigation components"
```

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
- Follow atomic design principles (atoms → molecules → organisms → templates)
- Ensure mobile-first responsive design
- Maintain accessibility compliance (WCAG 2.1)
- All Vue components MUST use `<script setup>` syntax (Constitution compliance)
- All composables MUST include TypeScript interfaces (Constitution compliance)
- Mobile features include hamburger menu, sidebar toggle, and responsive behavior
- Performance targets: <100ms navigation transitions, <2s initial load
- Notification message for non-existent pages: "This section is coming soon. You've been redirected to the welcome page."

## Task Generation Rules

_Applied during main() execution_

1. **From Contracts**:
   - navigation-api.yaml → contract test task [P]
   - Each endpoint → implementation task
2. **From Data Model**:
   - NavigationItem entity → type definition task [P]
   - AppBranding entity → type definition task [P]
   - WelcomeContent entity → type definition task [P]
   - State management → composable tasks
3. **From User Stories**:
   - Desktop navigation → integration test [P]
   - Mobile navigation → integration test [P]
   - Responsive behavior → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Types → Composables → Components → Pages → API → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist

_GATE: Checked by main() before returning_

- [x] All contracts have corresponding tests
- [x] All entities have model tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
