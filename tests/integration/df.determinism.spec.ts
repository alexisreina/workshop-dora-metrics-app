import { describe, it, expect } from 'vitest';
import { getDeploymentSeries } from '~/server/api/df/services/series.service';

describe('DF determinism', () => {
  it('returns identical series for same inputs', async () => {
    const a = getDeploymentSeries({ groupBy: 'day', preset: '30d' });
    const b = getDeploymentSeries({ groupBy: 'day', preset: '30d' });
    expect(a).toEqual(b);
  });
});
