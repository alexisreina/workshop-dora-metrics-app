import type {
  ChangeFailureRateResponse,
  HistoricalDataResponse,
} from '~/types/metrics';
import type { BenchmarkResponse } from '~/types/common';
import { TimePeriodType } from '~/types/enums';

export interface UseChangeFailureRateOptions {
  period?: TimePeriodType;
  startDate?: string;
  endDate?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useChangeFailureRate = (
  options: UseChangeFailureRateOptions = {}
) => {
  const {
    period = TimePeriodType.MONTHLY,
    startDate,
    endDate,
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
  } = options;

  // Reactive state
  const currentMetric = ref<ChangeFailureRateResponse | null>(null);
  const historicalData = ref<HistoricalDataResponse | null>(null);
  const benchmarks = ref<BenchmarkResponse | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Build query parameters
  const buildQueryParams = (
    customPeriod?: TimePeriodType,
    customStartDate?: string,
    customEndDate?: string
  ) => {
    const params = new URLSearchParams();

    if (customStartDate && customEndDate) {
      params.append('startDate', customStartDate);
      params.append('endDate', customEndDate);
    } else {
      params.append('period', customPeriod || period);
    }

    return params.toString();
  };

  // Fetch current metric
  const fetchCurrentMetric = async (
    customPeriod?: TimePeriodType,
    customStartDate?: string,
    customEndDate?: string
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const queryParams = buildQueryParams(
        customPeriod,
        customStartDate,
        customEndDate
      );
      const response = await $fetch<ChangeFailureRateResponse>(
        `/api/metrics/change-failure-rate/?${queryParams}`
      );

      currentMetric.value = response;
      return response;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to fetch current metric';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async (
    customPeriod?: TimePeriodType,
    limit = 12
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const params = new URLSearchParams();
      params.append('period', customPeriod || period);
      params.append('limit', limit.toString());

      const response = await $fetch<HistoricalDataResponse>(
        `/api/metrics/change-failure-rate/historical?${params.toString()}`
      );

      historicalData.value = response;
      return response;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to fetch historical data';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch benchmarks
  const fetchBenchmarks = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<BenchmarkResponse>(
        '/api/metrics/change-failure-rate/benchmarks'
      );

      benchmarks.value = response;
      return response;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to fetch benchmarks';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch all data
  const fetchAllData = async (
    customPeriod?: TimePeriodType,
    customStartDate?: string,
    customEndDate?: string
  ) => {
    await Promise.all([
      fetchCurrentMetric(customPeriod, customStartDate, customEndDate),
      fetchHistoricalData(customPeriod),
      fetchBenchmarks(),
    ]);
  };

  // Refresh data
  const refresh = async () => {
    await fetchAllData();
  };

  // Auto-refresh setup
  let refreshTimer: NodeJS.Timeout | null = null;

  const startAutoRefresh = () => {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(refresh, refreshInterval);
  };

  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  };

  // Computed properties
  const currentBenchmark = computed(() => {
    if (!currentMetric.value || !benchmarks.value) return null;

    return benchmarks.value.benchmarks.find(
      (benchmark) =>
        currentMetric.value!.metric.value >= benchmark.minValue &&
        currentMetric.value!.metric.value <= benchmark.maxValue
    );
  });

  const trendDirection = computed(() => {
    if (!historicalData.value || historicalData.value.data.length < 2)
      return 'stable';

    const data = historicalData.value.data;
    const recent = data[data.length - 1].value;
    const previous = data[data.length - 2].value;

    if (recent < previous) return 'improving'; // Lower failure rate is better
    if (recent > previous) return 'degrading';
    return 'stable';
  });

  const isDataSufficient = computed(() => {
    return (
      currentMetric.value?.dataQuality === 'complete' ||
      currentMetric.value?.dataQuality === 'partial'
    );
  });

  // Lifecycle
  onMounted(() => {
    fetchAllData();
    if (autoRefresh) startAutoRefresh();
  });

  onUnmounted(() => {
    stopAutoRefresh();
  });

  return {
    // State
    currentMetric: readonly(currentMetric),
    historicalData: readonly(historicalData),
    benchmarks: readonly(benchmarks),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    currentBenchmark,
    trendDirection,
    isDataSufficient,

    // Methods
    fetchCurrentMetric,
    fetchHistoricalData,
    fetchBenchmarks,
    fetchAllData,
    refresh,
    startAutoRefresh,
    stopAutoRefresh,
  };
};
