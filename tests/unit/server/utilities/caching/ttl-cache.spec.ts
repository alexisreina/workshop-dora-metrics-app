import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockNow = vi.fn(() => Date.now());

vi.mock('node:timers/promises', async (importOriginal) => {
  const timers = await importOriginal();
  return {
    ...timers,
    setTimeout: vi.fn(),
  };
});

describe('ttl-cache helper (pre-implementation)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stores values with default TTL', () => {
    const { createCache } = require('../../../../server/utilities/caching/ttl-cache');
    const cache = createCache({ now: mockNow });

    cache.set('key', 'value');

    expect(cache.get('key')).toBe('value');
  });

  it('evicts values after five minutes plus jitter', () => {
    const { createCache } = require('../../../../server/utilities/caching/ttl-cache');
    const cache = createCache({ now: mockNow });

    cache.set('key', 'value');

    mockNow.mockReturnValue(Date.now() + 301_000);

    expect(cache.get('key')).toBeUndefined();
  });

  it('applies jitter to reduce stampedes', () => {
    const { createCache } = require('../../../../server/utilities/caching/ttl-cache');
    const cache = createCache({ now: mockNow, jitter: () => 5_000 });

    cache.set('key', 'value');

    mockNow.mockReturnValue(Date.now() + 304_000);

    expect(cache.get('key')).toBeUndefined();
  });
});

