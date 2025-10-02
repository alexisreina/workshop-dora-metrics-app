// Global test setup
import { config } from '@vue/test-utils';

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
