<!--
Sync Impact Report:
Version change: 1.0.0 → 1.1.0
Modified principles: All principles updated for frontend application
Added sections: Technology Stack, Code Quality Standards, Development Workflow
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

### I. SOLID Principles Compliance

All components and modules MUST follow SOLID principles: Single Responsibility (each component has one clear purpose), Open/Closed (extensible without modification), Liskov Substitution (components are interchangeable), Interface Segregation (focused interfaces), and Dependency Inversion (depend on abstractions, not concretions). This ensures maintainable, testable, and scalable code architecture.

### II. Vue 3 Composition API First

Components MUST use Vue 3 Composition API with `<script setup>` syntax for all new development. The Composition API provides better TypeScript integration, logic reuse, and code organization. Options API is acceptable only for legacy integration or simple components. Use `ref` for primitive values, `reactive` for objects, and leverage composables for shared logic.

### III. Nuxt 4 Full-Stack Framework

The application MUST use Nuxt 4 as the primary framework for both frontend and backend operations. Leverage Nuxt's file-based routing, auto-imports, server-side rendering, and module system. Configure modules in `nuxt.config.ts` and utilize Nuxt's built-in features for optimal developer experience and performance.

### IV. PrimeVue Component Library

UI components MUST use PrimeVue as the primary component library. Configure PrimeVue through the `@primevue/nuxt-module` and utilize the comprehensive set of pre-built, accessible components. Customize themes using PrimeVue's theming system while maintaining consistency across the application.

### V. Tailwind CSS Utility-First Styling

All styling MUST use Tailwind CSS utility classes for rapid, consistent UI development. Follow the utility-first approach by composing styles directly in templates using Tailwind classes. Use `@apply` directive sparingly and only for complex, reusable component styles. Avoid custom CSS unless absolutely necessary.

### VI. KISS Principle (Keep It Simple, Stupid)

Complexity MUST be justified and minimized. Prefer straightforward solutions over complex abstractions. Start simple and add complexity only when proven necessary. Avoid over-engineering and prioritize clarity and maintainability over clever implementations.

### VII. Code Quality Standards

All code MUST pass ESLint and Prettier validation. Use TypeScript for type safety and better developer experience. Follow consistent naming conventions, proper error handling, and comprehensive testing. Maintain clean, readable code with meaningful variable and function names.

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
- Follow accessibility guidelines (WCAG 2.1)

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

## Governance

This constitution supersedes all other development practices and MUST be followed by all team members. Amendments require documentation of rationale, approval from technical leads, and migration plan for existing code. All pull requests and code reviews MUST verify compliance with these principles. Complexity additions MUST be justified with clear business value and technical necessity.

**Version**: 1.1.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
