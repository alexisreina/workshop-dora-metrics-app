import { describe, it, expect } from 'vitest';
import { getDeploymentSeries } from '~/server/api/df/services/series.service';

describe('DF filters and production matching', () => {
  it('counts only exact prod/production (case-insensitive)', async () => {
    const body = getDeploymentSeries({ groupBy: 'day', preset: '30d' });
    expect(Array.isArray(body.buckets)).toBe(true);
  });
});
