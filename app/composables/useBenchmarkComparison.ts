import type { BenchmarkData } from '~/types/common';
import { BenchmarkCategory } from '~/types/enums';

export interface BenchmarkComparison {
  currentCategory: BenchmarkData | null;
  isElite: boolean;
  isHigh: boolean;
  isMedium: boolean;
  isLow: boolean;
  percentileRank: number;
  improvementTarget: BenchmarkData | null;
  distanceToNext: number | null;
}

export const useBenchmarkComparison = () => {
  // Get benchmark for a specific value
  const getBenchmarkForValue = (
    value: number,
    benchmarks: BenchmarkData[]
  ): BenchmarkData | null => {
    return (
      benchmarks.find(
        (benchmark) =>
          value >= benchmark.minValue && value <= benchmark.maxValue
      ) || null
    );
  };

  // Calculate percentile rank within category
  const calculatePercentileRank = (
    value: number,
    benchmark: BenchmarkData | null
  ): number => {
    if (!benchmark) return 0;

    const range = benchmark.maxValue - benchmark.minValue;
    if (range === 0) return 100;

    // For failure rates, lower is better, so invert the calculation
    const positionInRange = (value - benchmark.minValue) / range;
    return Math.round((1 - positionInRange) * 100);
  };

  // Get improvement target (next better category)
  const getImprovementTarget = (
    currentBenchmark: BenchmarkData | null,
    benchmarks: BenchmarkData[]
  ): BenchmarkData | null => {
    if (!currentBenchmark) return null;

    const categoryOrder = [
      BenchmarkCategory.LOW,
      BenchmarkCategory.MEDIUM,
      BenchmarkCategory.HIGH,
      BenchmarkCategory.ELITE,
    ];
    const currentIndex = categoryOrder.indexOf(currentBenchmark.category);

    if (currentIndex <= 0) return null; // Already at elite or not found

    const targetCategory = categoryOrder[currentIndex - 1];
    return benchmarks.find((b) => b.category === targetCategory) || null;
  };

  // Calculate distance to next category
  const calculateDistanceToNext = (
    value: number,
    currentBenchmark: BenchmarkData | null,
    improvementTarget: BenchmarkData | null
  ): number | null => {
    if (!currentBenchmark || !improvementTarget) return null;

    // Distance is the difference between current value and the max value of the target category
    return Math.max(0, value - improvementTarget.maxValue);
  };

  // Get benchmark comparison for a value
  const getBenchmarkComparison = (
    value: number,
    benchmarks: BenchmarkData[]
  ): BenchmarkComparison => {
    const currentCategory = getBenchmarkForValue(value, benchmarks);
    const improvementTarget = getImprovementTarget(currentCategory, benchmarks);
    const percentileRank = calculatePercentileRank(value, currentCategory);
    const distanceToNext = calculateDistanceToNext(
      value,
      currentCategory,
      improvementTarget
    );

    return {
      currentCategory,
      isElite: currentCategory?.category === BenchmarkCategory.ELITE,
      isHigh: currentCategory?.category === BenchmarkCategory.HIGH,
      isMedium: currentCategory?.category === BenchmarkCategory.MEDIUM,
      isLow: currentCategory?.category === BenchmarkCategory.LOW,
      percentileRank,
      improvementTarget,
      distanceToNext,
    };
  };

  // Get color class for benchmark category
  const getBenchmarkColor = (
    category: BenchmarkCategory | undefined
  ): string => {
    switch (category) {
      case BenchmarkCategory.ELITE:
        return 'text-green-600 bg-green-50 border-green-200';
      case BenchmarkCategory.HIGH:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case BenchmarkCategory.MEDIUM:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case BenchmarkCategory.LOW:
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get icon for benchmark category
  const getBenchmarkIcon = (
    category: BenchmarkCategory | undefined
  ): string => {
    switch (category) {
      case BenchmarkCategory.ELITE:
        return '🏆';
      case BenchmarkCategory.HIGH:
        return '⭐';
      case BenchmarkCategory.MEDIUM:
        return '📊';
      case BenchmarkCategory.LOW:
        return '⚠️';
      default:
        return '❓';
    }
  };

  // Get improvement message
  const getImprovementMessage = (comparison: BenchmarkComparison): string => {
    if (comparison.isElite) {
      return "Excellent! You're performing at an elite level.";
    }

    if (!comparison.improvementTarget) {
      return 'Keep up the good work!';
    }

    const targetName =
      comparison.improvementTarget.category.charAt(0).toUpperCase() +
      comparison.improvementTarget.category.slice(1);

    if (comparison.distanceToNext !== null && comparison.distanceToNext > 0) {
      return `To reach ${targetName} performance, reduce your failure rate by ${comparison.distanceToNext}%.`;
    }

    return `You're close to ${targetName} performance level!`;
  };

  // Format benchmark range for display
  const formatBenchmarkRange = (benchmark: BenchmarkData): string => {
    if (benchmark.minValue === 0 && benchmark.maxValue === 5) {
      return '0-5%';
    }
    if (benchmark.maxValue === 100) {
      return `${benchmark.minValue}%+`;
    }
    return `${benchmark.minValue}-${benchmark.maxValue}%`;
  };

  return {
    getBenchmarkForValue,
    calculatePercentileRank,
    getImprovementTarget,
    calculateDistanceToNext,
    getBenchmarkComparison,
    getBenchmarkColor,
    getBenchmarkIcon,
    getImprovementMessage,
    formatBenchmarkRange,
  };
};
