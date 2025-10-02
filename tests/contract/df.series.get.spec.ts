import { describe, it, expect } from 'vitest';
import { getDeploymentSeries } from '~/server/api/df/services/series.service';

describe('GET /api/df/series contract', () => {
  it('returns DeploymentSeries schema', async () => {
    const body = getDeploymentSeries({ groupBy: 'day', preset: '6m' });

    expect(body).toMatchObject({
      grouping: expect.stringMatching(/^(day|week|month)$/),
    });

    expect(Array.isArray(body.buckets)).toBe(true);
    if (body.buckets.length > 0) {
      const b = body.buckets[0];
      expect(typeof b.label).toBe('string');
      expect(typeof b.start).toBe('string');
      expect(typeof b.end).toBe('string');
      expect(typeof b.count).toBe('number');
    }

    if (body.rollingAverage) {
      expect(Array.isArray(body.rollingAverage)).toBe(true);
      if (body.rollingAverage.length > 0) {
        const r = body.rollingAverage[0];
        expect(typeof r.label).toBe('string');
        expect(typeof r.value).toBe('number');
      }
    }
  });
});
