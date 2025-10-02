import type { BenchmarkData, BenchmarkResponse } from '~/types/common';
import { BenchmarkCategory } from '~/types/enums';

export const CHANGE_FAILURE_RATE_BENCHMARKS: BenchmarkData[] = [
  {
    category: BenchmarkCategory.ELITE,
    minValue: 0,
    maxValue: 5,
    description:
      'Elite performers have very low failure rates, indicating excellent deployment practices and robust testing',
    source: 'DORA State of DevOps Report 2023',
  },
  {
    category: BenchmarkCategory.HIGH,
    minValue: 6,
    maxValue: 10,
    description:
      'High performers maintain good deployment quality with minimal production issues',
    source: 'DORA State of DevOps Report 2023',
  },
  {
    category: BenchmarkCategory.MEDIUM,
    minValue: 11,
    maxValue: 20,
    description:
      'Medium performers have moderate failure rates with room for improvement in testing and deployment practices',
    source: 'DORA State of DevOps Report 2023',
  },
  {
    category: BenchmarkCategory.LOW,
    minValue: 21,
    maxValue: 100,
    description:
      'Low performers experience frequent deployment failures, indicating need for improved practices',
    source: 'DORA State of DevOps Report 2023',
  },
];

export function getBenchmarkResponse(): BenchmarkResponse {
  return {
    benchmarks: CHANGE_FAILURE_RATE_BENCHMARKS,
    source: 'DORA State of DevOps Report 2023',
    lastUpdated: '2023-10-01',
  };
}

export function getBenchmarkForValue(value: number): BenchmarkData | undefined {
  return CHANGE_FAILURE_RATE_BENCHMARKS.find(
    (benchmark) => value >= benchmark.minValue && value <= benchmark.maxValue
  );
}
