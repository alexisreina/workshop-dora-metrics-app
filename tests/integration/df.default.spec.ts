import { describe, it, expect } from 'vitest';
import { getDeploymentSeries } from '~/server/api/df/services/series.service';
import { getDeploymentSummary } from '~/server/api/df/services/summary.service';
import { getDeploymentEvents } from '~/server/api/df/services/events.service';

describe('DF default load', () => {
  it('shows chart, summary, and events with deterministic data', async () => {
    const series = getDeploymentSeries({ groupBy: 'day', preset: '6m' });
    const summary = getDeploymentSummary({ groupBy: 'day', preset: '6m' });
    const events = getDeploymentEvents({ preset: '6m' });

    expect(Array.isArray(series.buckets)).toBe(true);
    expect(typeof summary.totalProductionSuccesses).toBe('number');
    expect(Array.isArray(events)).toBe(true);
  });
});
