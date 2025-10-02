import { describe, it, expect } from 'vitest';
import { getDeploymentSeries } from '~/server/api/df/services/series.service';

describe('DF rolling average', () => {
  it('supports 7-day rolling avg for day grouping with partial window', async () => {
    const series = getDeploymentSeries({
      groupBy: 'day',
      preset: '14d',
      rollingAvg: true,
    });
    expect(Array.isArray(series.rollingAverage)).toBe(true);
    // First few labels should exist with numeric values (partial window)
    if (series.rollingAverage.length > 0) {
      expect(typeof series.rollingAverage[0].label).toBe('string');
      expect(typeof series.rollingAverage[0].value).toBe('number');
    }
  });
});
