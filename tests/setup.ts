import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'node:util';

if (!(globalThis.TextEncoder instanceof Function)) {
  // @ts-expect-error: assigning Node polyfill to global scope for Vitest
  globalThis.TextEncoder = TextEncoder;
}

if (!(globalThis.TextDecoder instanceof Function)) {
  // @ts-expect-error: assigning Node polyfill to global scope for Vitest
  globalThis.TextDecoder = TextDecoder;
}

try {
  const encoder = new globalThis.TextEncoder();
  const EncodedCtor = encoder.encode('').constructor;

  if (EncodedCtor !== globalThis.Uint8Array) {
    // ensure TextEncoder returns the shared Uint8Array realm
    // @ts-expect-error: reassign encode for jsdom compatibility
    globalThis.TextEncoder = class extends TextEncoder {
      encode(input?: string) {
        return new globalThis.Uint8Array(super.encode(input || ''));
      }
    };
  }
} catch (error) {
  console.warn('TextEncoder polyfill adjustment failed:', error);
}

// Silence Nuxt composable warnings in jsdom environment
globalThis.useRuntimeConfig = () => ({
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

