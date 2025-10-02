import { describe, it, expect } from 'vitest';
import type { ChangeFailureRateResponse } from '~/types/metrics';

describe('Contract Test: GET /api/metrics/change-failure-rate/', () => {
  it('should return current Change Failure Rate metric with default monthly period', async () => {
    const response = await $fetch<ChangeFailureRateResponse>(
      '/api/metrics/change-failure-rate/'
    );

    // Validate response structure
    expect(response).toHaveProperty('metric');
    expect(response).toHaveProperty('period');
    expect(response).toHaveProperty('dataQuality');
    expect(response).toHaveProperty('lastUpdated');

    // Validate metric properties
    expect(response.metric).toHaveProperty('value');
    expect(response.metric).toHaveProperty('totalDeployments');
    expect(response.metric).toHaveProperty('failedDeployments');
    expect(response.metric).toHaveProperty('calculatedAt');

    // Validate data types and ranges
    expect(typeof response.metric.value).toBe('number');
    expect(response.metric.value).toBeGreaterThanOrEqual(0);
    expect(response.metric.value).toBeLessThanOrEqual(100);
    expect(Number.isInteger(response.metric.value)).toBe(true); // Whole numbers only

    expect(typeof response.metric.totalDeployments).toBe('number');
    expect(response.metric.totalDeployments).toBeGreaterThanOrEqual(0);

    expect(typeof response.metric.failedDeployments).toBe('number');
    expect(response.metric.failedDeployments).toBeGreaterThanOrEqual(0);
    expect(response.metric.failedDeployments).toBeLessThanOrEqual(
      response.metric.totalDeployments
    );

    // Validate period structure
    expect(response.period).toHaveProperty('startDate');
    expect(response.period).toHaveProperty('endDate');
    expect(response.period).toHaveProperty('type');
    expect(response.period).toHaveProperty('label');
    expect(response.period.type).toBe('monthly'); // Default period

    // Validate data quality enum
    expect(['complete', 'partial', 'insufficient']).toContain(
      response.dataQuality
    );
  });

  it('should accept period query parameter', async () => {
    const response = await $fetch<ChangeFailureRateResponse>(
      '/api/metrics/change-failure-rate/?period=weekly'
    );

    expect(response.period.type).toBe('weekly');
  });

  it('should accept custom date range parameters', async () => {
    const startDate = '2025-09-01';
    const endDate = '2025-10-01';
    const response = await $fetch<ChangeFailureRateResponse>(
      `/api/metrics/change-failure-rate/?startDate=${startDate}&endDate=${endDate}`
    );

    expect(response.period.startDate).toBe(startDate);
    expect(response.period.endDate).toBe(endDate);
  });

  it('should return 400 for invalid period parameter', async () => {
    await expect(
      $fetch('/api/metrics/change-failure-rate/?period=invalid')
    ).rejects.toThrow();
  });

  it('should return 400 for invalid date format', async () => {
    await expect(
      $fetch('/api/metrics/change-failure-rate/?startDate=invalid-date')
    ).rejects.toThrow();
  });
});
