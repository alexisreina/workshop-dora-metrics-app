# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
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
- [ ] T001 Create Nuxt 4 project structure per implementation plan
- [ ] T002 Initialize Nuxt 4 project with Vue 3, PrimeVue, and Tailwind CSS dependencies
- [ ] T003 [P] Configure ESLint, Prettier, and TypeScript
- [ ] T004 [P] Setup PrimeVue module configuration in nuxt.config.ts
- [ ] T005 [P] Configure Tailwind CSS with PrimeVue integration

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test POST /api/users in tests/contract/test_users_post.ts
- [ ] T007 [P] Contract test GET /api/users/{id} in tests/contract/test_users_get.ts
- [ ] T008 [P] Component test for user registration form in tests/unit/components/UserRegistrationForm.test.ts
- [ ] T009 [P] Integration test user registration flow in tests/integration/test_registration.ts
- [ ] T010 [P] Integration test auth flow in tests/integration/test_auth.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T011 [P] User composable in app/composables/useUser.ts
- [ ] T012 [P] UserService CRUD in app/services/userService.ts
- [ ] T013 [P] UserRegistrationForm component in app/components/organisms/UserRegistrationForm.vue
- [ ] T014 [P] UserList component in app/components/organisms/UserList.vue
- [ ] T015 POST /api/users endpoint in app/server/api/users.post.ts
- [ ] T016 GET /api/users/[id].get.ts endpoint
- [ ] T017 Input validation composable in app/composables/useValidation.ts
- [ ] T018 Error handling and logging middleware

## Phase 3.4: Integration
- [ ] T019 Connect UserService to database/storage
- [ ] T020 Auth middleware in app/middleware/auth.ts
- [ ] T021 Request/response logging plugin
- [ ] T022 CORS and security headers configuration
- [ ] T023 PrimeVue theme customization
- [ ] T024 Tailwind CSS component styling

## Phase 3.5: Polish
- [ ] T025 [P] Unit tests for composables in tests/unit/composables/
- [ ] T026 [P] Component tests for all Vue components
- [ ] T027 Performance tests (<200ms page load)
- [ ] T028 [P] Update documentation
- [ ] T029 Remove code duplication
- [ ] T030 Accessibility testing and improvements
- [ ] T031 Run manual testing scenarios

## Dependencies
- Tests (T006-T010) before implementation (T011-T018)
- T011 blocks T012, T019
- T013 blocks T014 (shared user data)
- T020 blocks T022
- Implementation before polish (T025-T031)

## Parallel Example
```
# Launch T006-T010 together:
Task: "Contract test POST /api/users in tests/contract/test_users_post.ts"
Task: "Contract test GET /api/users/{id} in tests/contract/test_users_get.ts"
Task: "Component test for user registration form in tests/unit/components/UserRegistrationForm.test.ts"
Task: "Integration test registration in tests/integration/test_registration.ts"
Task: "Integration test auth in tests/integration/test_auth.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task