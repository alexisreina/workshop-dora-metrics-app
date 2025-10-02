import { describe, it, expect } from 'vitest';
import type { BenchmarkResponse } from '~/types/common';

describe('Contract Test: GET /api/metrics/change-failure-rate/benchmarks', () => {
  it('should return industry benchmark data', async () => {
    const response = await $fetch<BenchmarkResponse>(
      '/api/metrics/change-failure-rate/benchmarks'
    );

    // Validate response structure
    expect(response).toHaveProperty('benchmarks');
    expect(response).toHaveProperty('source');
    expect(response).toHaveProperty('lastUpdated');

    // Validate benchmarks array
    expect(Array.isArray(response.benchmarks)).toBe(true);
    expect(response.benchmarks.length).toBe(4); // elite, high, medium, low

    // Validate benchmark categories are present
    const categories = response.benchmarks.map((b) => b.category);
    expect(categories).toContain('elite');
    expect(categories).toContain('high');
    expect(categories).toContain('medium');
    expect(categories).toContain('low');

    // Validate benchmark structure
    response.benchmarks.forEach((benchmark) => {
      expect(benchmark).toHaveProperty('category');
      expect(benchmark).toHaveProperty('minValue');
      expect(benchmark).toHaveProperty('maxValue');
      expect(benchmark).toHaveProperty('description');

      // Validate data types and ranges
      expect(['elite', 'high', 'medium', 'low']).toContain(benchmark.category);
      expect(typeof benchmark.minValue).toBe('number');
      expect(typeof benchmark.maxValue).toBe('number');
      expect(benchmark.minValue).toBeGreaterThanOrEqual(0);
      expect(benchmark.maxValue).toBeLessThanOrEqual(100);
      expect(benchmark.maxValue).toBeGreaterThanOrEqual(benchmark.minValue);
      expect(typeof benchmark.description).toBe('string');
      expect(benchmark.description.length).toBeGreaterThan(0);
    });

    // Validate source and lastUpdated
    expect(typeof response.source).toBe('string');
    expect(response.source.length).toBeGreaterThan(0);
    expect(typeof response.lastUpdated).toBe('string');
  });

  it('should return benchmarks in logical order (elite to low)', async () => {
    const response = await $fetch<BenchmarkResponse>(
      '/api/metrics/change-failure-rate/benchmarks'
    );

    const elite = response.benchmarks.find((b) => b.category === 'elite');
    const high = response.benchmarks.find((b) => b.category === 'high');
    const medium = response.benchmarks.find((b) => b.category === 'medium');
    const low = response.benchmarks.find((b) => b.category === 'low');

    expect(elite).toBeDefined();
    expect(high).toBeDefined();
    expect(medium).toBeDefined();
    expect(low).toBeDefined();

    // Elite should have the lowest failure rates
    expect(elite!.maxValue).toBeLessThan(high!.minValue);
    expect(high!.maxValue).toBeLessThan(medium!.minValue);
    expect(medium!.maxValue).toBeLessThan(low!.minValue);
  });

  it('should include DORA source attribution', async () => {
    const response = await $fetch<BenchmarkResponse>(
      '/api/metrics/change-failure-rate/benchmarks'
    );

    expect(response.source.toLowerCase()).toContain('dora');
  });
});
