import { describe, it, expect } from 'vitest';
import { getDeploymentSummary } from '~/server/api/df/services/summary.service';

describe('DF summary deltas', () => {
  it('includes delta and percent vs previous period', async () => {
    const body = getDeploymentSummary({ groupBy: 'day', preset: '30d' });
    expect(typeof body.previousPeriodDelta).toBe('number');
    expect(typeof body.previousPeriodPercentChange).toBe('number');
  });
});
