<!--
Sync Impact Report:
Version change: 1.0.0 → 1.2.0
Modified principles: Enhanced for DORA metrics focus with frontend application principles
Added sections: Technology Stack, Code Quality Standards, Development Workflow, DORA-specific principles
Removed sections: None (template structure maintained)
Templates requiring updates:
  ✅ plan-template.md (updated for frontend principles)
  ✅ spec-template.md (updated for frontend scope)
  ✅ tasks-template.md (updated for frontend task types)
  ✅ agent-file-template.md (updated for frontend context)
Follow-up TODOs: None
-->
# Workshop DORA Metrics App Constitution

## Core Principles

### I. Metric Integrity First
Metric calculations MUST be reproducible, sourced from auditable data pipelines, and validated against authoritative systems of record before exposure. Every visualization MUST describe its data freshness, filters, and known caveats inline.
Rationale: DORA guidance depends on trustworthy numbers; any degradation in data accuracy erodes confidence in the entire product.

### II. SOLID Principles Compliance
All components and modules MUST follow SOLID principles: Single Responsibility (each component has one clear purpose), Open/Closed (extensible without modification), Liskov Substitution (components are interchangeable), Interface Segregation (focused interfaces), and Dependency Inversion (depend on abstractions, not concretions). This ensures maintainable, testable, and scalable code architecture.

### III. Vue 3 Composition API First
Components MUST use Vue 3 Composition API with `<script setup>` syntax for all new development. The Composition API provides better TypeScript integration, logic reuse, and code organization. Options API is acceptable only for legacy integration or simple components. Use `ref` for primitive values, `reactive` for objects, and leverage composables for shared logic.

### IV. Accessible Insight Delivery
The user interface MUST meet WCAG 2.2 AA contrast and keyboard navigation requirements, render critical views within 2 seconds on reference hardware, and remain usable without JavaScript enhancements. All graphs MUST include descriptive text summaries for screen reader users.
Rationale: Leaders act on these metrics under time pressure; inclusivity and responsiveness ensure decisions are never blocked by the tooling.

### V. Test-Led Iteration
Teams MUST create failing unit, component, and end-to-end tests that describe desired behavior before shipping features or fixes. CI MUST block merges unless the test suite passes on the target branch and captures regression coverage for newly added metrics.
Rationale: Testing guards metric integrity and protects the cadence needed to improve DORA performance.

### VI. Operational Transparency
Instrumentation for usage analytics, error logging, and performance baselines MUST be added alongside new functionality. Dashboards MUST surface release health, lead time, deployment frequency, and change failure rate within one iteration of feature launch.
Rationale: Observability makes it possible to detect regressions quickly and demonstrate DORA improvements to stakeholders.

### VII. Deliberate Simplicity & Reuse
Implementations MUST favor vetted Nuxt, PrimeVue, and shared component patterns over bespoke solutions. Cross-cutting concerns (layout, theming, telemetry) MUST be centralized, and dead code MUST be removed within the current iteration.
Rationale: Consistency keeps the front-end maintainable and lets the team focus on metric quality instead of plumbing.

## Technology Stack

### Frontend Framework
- **Vue 3**: Progressive JavaScript framework with Composition API
- **Nuxt 4**: Full-stack Vue framework for SSR and backend operations
- **TypeScript**: Type-safe JavaScript development

### UI and Styling
- **PrimeVue**: Comprehensive Vue component library
- **Tailwind CSS**: Utility-first CSS framework
- **@frontiers/prime-preset**: Custom PrimeVue theme preset

### Development Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting and consistency
- **Vue DevTools**: Development and debugging support

### Build and Deployment
- **Vite**: Fast build tool and development server
- **Node.js**: Runtime environment
- **npm/pnpm**: Package management

## Engineering Guardrails
- Primary stack: Nuxt 4 + PrimeVue 4 + Tailwind CSS; deviations require explicit review and proof of necessity.
- Data interactions MUST traverse typed client services; direct fetch calls in views are prohibited.
- Configuration values related to data sources, environments, and feature flags MUST reside in a single configuration registry under version control.
- Performance budgets: Largest Contentful Paint ≤ 2.0 s, interaction latency ≤ 150 ms, bundle size budgets documented per route.
- All code MUST pass ESLint and Prettier validation with TypeScript for type safety.

## Development Workflow

### Code Organization
- Use atomic design principles: atoms, molecules, organisms, templates
- Implement single-file components with `<script setup>`
- Organize code by feature, not by file type
- Maintain clear separation between presentation and business logic

### Component Development
- Create reusable, composable components
- Use TypeScript interfaces for prop definitions
- Implement proper error boundaries and loading states
- Follow accessibility guidelines (WCAG 2.2 AA)

### State Management
- Use Vue 3's built-in reactivity system
- Implement composables for shared state logic
- Consider Pinia for complex state management needs
- Avoid prop drilling through proper component architecture

### Testing Strategy
- Write unit tests for composables and utility functions
- Implement component testing with Vue Test Utils
- Use integration tests for critical user flows
- Maintain high test coverage for business logic

### Workflow Expectations
- Feature work begins with a `/specs/.../spec.md` that references the applicable principles and outlines Constitution Check considerations.
- Pull requests MUST cite the impacted principles, list new or updated tests, and link telemetry or monitoring adjustments when applicable.
- Code review CHECKLISTS MUST include verification of data validation, accessibility, and instrumentation updates.
- Release notes MUST summarize DORA metric impacts and flag follow-up instrumentation tasks.

## Governance

This constitution supersedes all other development practices and MUST be followed by all team members. Amendments require documentation of rationale, approval from technical leads, and migration plan for existing code. All pull requests and code reviews MUST verify compliance with these principles. Complexity additions MUST be justified with clear business value and technical necessity.

- The Constitution supersedes conflicting team conventions. Compliance is evaluated during plan reviews, code reviews, and release readiness checks.
- Amendments require consensus of tech lead and product owner, documented rationale, updated version number, and execution of impacted migration tasks.
- Versioning follows semantic rules: MAJOR for removals or incompatible rewrites, MINOR for new principles or mandatory processes, PATCH for clarifications.
- Compliance reviews run quarterly; non-compliance issues must enter the backlog with clear owners and due dates.

**Version**: 1.2.0 | **Ratified**: 2025-10-02 | **Last Amended**: 2025-10-02
