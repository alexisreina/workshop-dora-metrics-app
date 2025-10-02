import { describe, it, expect } from 'vitest';
import { getDeploymentSummary } from '~/server/api/df/services/summary.service';

describe('GET /api/df/summary contract', () => {
  it('returns DeploymentSummary schema', async () => {
    const body = getDeploymentSummary({ groupBy: 'day', preset: '6m' });

    expect(typeof body.totalProductionSuccesses).toBe('number');
    expect(typeof body.averagePerBucket).toBe('number');
    expect(typeof body.previousPeriodDelta).toBe('number');
    expect(typeof body.previousPeriodPercentChange).toBe('number');
  });
});
