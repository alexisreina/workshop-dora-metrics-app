import { describe, it, expect } from 'vitest';
import { getDeploymentSeries } from '~/server/api/df/services/series.service';

describe('DF grouping labels', () => {
  it('labels day, week, month correctly', async () => {
    const day = getDeploymentSeries({ groupBy: 'day', preset: '14d' });
    const week = getDeploymentSeries({ groupBy: 'week', preset: '90d' });
    const month = getDeploymentSeries({ groupBy: 'month', preset: '6m' });

    expect(day.buckets[0].label).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(week.buckets[0].label).toMatch(/^\d{4}-W\d{2}$/);
    expect(month.buckets[0].label).toMatch(/^\d{4}-\d{2}$/);
  });
});
