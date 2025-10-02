// Global test setup
import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock Nuxt composables
global.useRoute = () => ({
  path: '/',
  params: {},
  query: {},
});

global.useRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
});

global.useHead = vi.fn();
global.navigateTo = vi.fn();

// Mock runtime config for Jira integration
global.useRuntimeConfig = () => ({
  jira: {
    baseUrl: 'https://example.atlassian.net',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    refreshIntervalMs: 300000,
  },
  public: {
    jira: {
      refreshIntervalMs: 300000,
    },
  },
});

// Configure Vue Test Utils
config.global.mocks = {
  $route: {
    path: '/',
    params: {},
    query: {},
  },
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
  },
};
