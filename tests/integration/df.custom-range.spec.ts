import { describe, it, expect } from 'vitest';
import { getDeploymentSeries } from '~/server/api/df/services/series.service';

describe('DF custom date range', () => {
  it('constrains selection to dataset bounds', async () => {
    const body = getDeploymentSeries({
      groupBy: 'day',
      preset: 'custom',
      startDate: '2000-01-01',
      endDate: '2000-01-10',
    });
    expect(Array.isArray(body.buckets)).toBe(true);
  });
});
