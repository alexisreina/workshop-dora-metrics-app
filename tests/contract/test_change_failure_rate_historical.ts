import { describe, it, expect } from 'vitest';
import type { HistoricalDataResponse } from '~/types/metrics';

describe('Contract Test: GET /api/metrics/change-failure-rate/historical', () => {
  it('should return historical Change Failure Rate data with default parameters', async () => {
    const response = await $fetch<HistoricalDataResponse>(
      '/api/metrics/change-failure-rate/historical'
    );

    // Validate response structure
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('period');
    expect(response).toHaveProperty('totalPoints');

    // Validate data array
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data.length).toBeLessThanOrEqual(12); // Default limit

    // Validate data point structure
    const dataPoint = response.data[0];
    expect(dataPoint).toHaveProperty('date');
    expect(dataPoint).toHaveProperty('value');
    expect(dataPoint).toHaveProperty('totalDeployments');
    expect(dataPoint).toHaveProperty('failedDeployments');

    // Validate data point types and ranges
    expect(typeof dataPoint.date).toBe('string');
    expect(typeof dataPoint.value).toBe('number');
    expect(dataPoint.value).toBeGreaterThanOrEqual(0);
    expect(dataPoint.value).toBeLessThanOrEqual(100);
    expect(Number.isInteger(dataPoint.value)).toBe(true); // Whole numbers only

    expect(typeof dataPoint.totalDeployments).toBe('number');
    expect(dataPoint.totalDeployments).toBeGreaterThanOrEqual(0);

    expect(typeof dataPoint.failedDeployments).toBe('number');
    expect(dataPoint.failedDeployments).toBeGreaterThanOrEqual(0);
    expect(dataPoint.failedDeployments).toBeLessThanOrEqual(
      dataPoint.totalDeployments
    );

    // Validate period and totalPoints
    expect(['daily', 'weekly', 'monthly', 'quarterly']).toContain(
      response.period
    );
    expect(response.period).toBe('monthly'); // Default period
    expect(response.totalPoints).toBe(response.data.length);
  });

  it('should accept period query parameter', async () => {
    const response = await $fetch<HistoricalDataResponse>(
      '/api/metrics/change-failure-rate/historical?period=weekly'
    );

    expect(response.period).toBe('weekly');
  });

  it('should accept limit query parameter', async () => {
    const limit = 6;
    const response = await $fetch<HistoricalDataResponse>(
      `/api/metrics/change-failure-rate/historical?limit=${limit}`
    );

    expect(response.data.length).toBeLessThanOrEqual(limit);
    expect(response.totalPoints).toBeLessThanOrEqual(limit);
  });

  it('should return data points in chronological order', async () => {
    const response = await $fetch<HistoricalDataResponse>(
      '/api/metrics/change-failure-rate/historical'
    );

    if (response.data.length > 1) {
      for (let i = 1; i < response.data.length; i++) {
        const prevDate = new Date(response.data[i - 1].date);
        const currDate = new Date(response.data[i].date);
        expect(currDate.getTime()).toBeGreaterThan(prevDate.getTime());
      }
    }
  });

  it('should return 400 for invalid period parameter', async () => {
    await expect(
      $fetch('/api/metrics/change-failure-rate/historical?period=invalid')
    ).rejects.toThrow();
  });

  it('should return 400 for invalid limit parameter', async () => {
    await expect(
      $fetch('/api/metrics/change-failure-rate/historical?limit=0')
    ).rejects.toThrow();

    await expect(
      $fetch('/api/metrics/change-failure-rate/historical?limit=101')
    ).rejects.toThrow();
  });
});
