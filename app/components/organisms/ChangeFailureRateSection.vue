<template>
  <div class="change-failure-rate-section">
    <!-- Filter Bar -->
    <FilterBar
      v-model="selectedPeriod"
      v-model:custom-start-date="customStartDate"
      v-model:custom-end-date="customEndDate"
      :loading="isLoading"
      :last-updated="currentMetric?.lastUpdated"
      @period-change="handlePeriodChange"
      @custom-range-change="handleCustomRangeChange"
      @refresh="handleRefresh"
      @reset="handleReset"
    />

    <!-- Main Content Grid -->
    <div class="cfr-content-grid">
      <!-- Current Metric Card -->
      <div class="cfr-metric-card">
        <MetricCard
          title="Change Failure Rate"
          :subtitle="currentMetric?.period.label"
          :value="currentMetric?.metric.value || 0"
          unit="%"
          size="large"
          :variant="metricVariant"
          :supporting-data="supportingData"
          :trend="trendDirection"
          :loading="isLoading"
          :error="error"
        >
          <template #footer>
            <div v-if="currentBenchmark" class="metric-benchmark">
              <BenchmarkIndicator
                :benchmark="currentBenchmark"
                :show-description="false"
                compact
              />
            </div>
          </template>
        </MetricCard>
      </div>

      <!-- Historical Trend Chart -->
      <div class="cfr-trend-chart">
        <TrendChart
          title="Historical Trend"
          :subtitle="`${historicalData?.period || 'monthly'} data points`"
          :data="historicalData?.data"
          :loading="isLoading"
          :error="error"
          height="350px"
        />
      </div>

      <!-- Benchmark Comparison -->
      <div class="cfr-benchmarks">
        <Card class="h-full">
          <template #header>
            <div class="benchmark-header">
              <h3 class="benchmark-title">Industry Benchmarks</h3>
              <div class="benchmark-subtitle">DORA Performance Categories</div>
            </div>
          </template>

          <template #content>
            <div v-if="benchmarks" class="benchmark-list">
              <BenchmarkIndicator
                v-for="benchmark in benchmarks.benchmarks"
                :key="benchmark.category"
                :benchmark="benchmark"
                :class="{
                  'benchmark-current':
                    benchmark.category === currentBenchmark?.category,
                }"
              />
            </div>

            <div v-if="benchmarkComparison" class="benchmark-insights">
              <div class="insight-item">
                <span class="insight-label">Your Performance:</span>
                <span class="insight-value">{{
                  benchmarkComparison.currentCategory?.category || 'Unknown'
                }}</span>
              </div>

              <div
                v-if="benchmarkComparison.improvementTarget"
                class="insight-item"
              >
                <span class="insight-label">Next Target:</span>
                <span class="insight-value">{{
                  benchmarkComparison.improvementTarget.category
                }}</span>
              </div>

              <div
                v-if="benchmarkComparison.distanceToNext !== null"
                class="insight-item"
              >
                <span class="insight-label">Improvement Needed:</span>
                <span class="insight-value"
                  >{{ benchmarkComparison.distanceToNext }}% reduction</span
                >
              </div>
            </div>

            <div v-if="improvementMessage" class="improvement-message">
              {{ improvementMessage }}
            </div>
          </template>

          <template #footer>
            <div class="benchmark-source">Source: {{ benchmarks?.source }}</div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Data Quality Warning -->
    <Message
      v-if="currentMetric?.dataQuality === 'insufficient'"
      severity="warn"
      class="data-quality-warning"
    >
      <template #icon>
        <i class="pi pi-exclamation-triangle"></i>
      </template>
      Insufficient data available for accurate calculation. Results may not be
      reliable.
    </Message>

    <Message
      v-else-if="currentMetric?.dataQuality === 'partial'"
      severity="info"
      class="data-quality-info"
    >
      <template #icon>
        <i class="pi pi-info-circle"></i>
      </template>
      Partial data available. Consider collecting more deployment data for
      improved accuracy.
    </Message>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Message from 'primevue/message';
import FilterBar from '~/components/molecules/FilterBar.vue';
import MetricCard from '~/components/molecules/MetricCard.vue';
import TrendChart from '~/components/molecules/TrendChart.vue';
import BenchmarkIndicator from '~/components/atoms/BenchmarkIndicator.vue';
import { useChangeFailureRate } from '~/composables/useChangeFailureRate';
import { useTimeFiltering } from '~/composables/useTimeFiltering';
import { useBenchmarkComparison } from '~/composables/useBenchmarkComparison';
import { TimePeriodType } from '~/types/enums';

// Composables
const {
  selectedPeriod,
  customDateRange,
  isCustomRange,
  setPeriod,
  setCustomDateRange,
  resetToDefault,
  getDateRangeLabel,
} = useTimeFiltering();

const {
  currentMetric,
  historicalData,
  benchmarks,
  isLoading,
  error,
  currentBenchmark,
  trendDirection,
  fetchAllData,
  refresh,
} = useChangeFailureRate();

const { getBenchmarkComparison, getImprovementMessage } =
  useBenchmarkComparison();

// Reactive state
const customStartDate = ref<Date | null>(null);
const customEndDate = ref<Date | null>(null);

// Computed properties
const supportingData = computed(() => {
  if (!currentMetric.value) return [];

  return [
    {
      label: 'Total Deployments',
      value: currentMetric.value.metric.totalDeployments,
    },
    {
      label: 'Failed Deployments',
      value: currentMetric.value.metric.failedDeployments,
    },
  ];
});

const metricVariant = computed(() => {
  if (!currentBenchmark.value) return 'default';

  switch (currentBenchmark.value.category) {
    case 'elite':
      return 'success';
    case 'high':
      return 'success';
    case 'medium':
      return 'warning';
    case 'low':
      return 'danger';
    default:
      return 'default';
  }
});

const benchmarkComparison = computed(() => {
  if (!currentMetric.value || !benchmarks.value) return null;

  return getBenchmarkComparison(
    currentMetric.value.metric.value,
    benchmarks.value.benchmarks
  );
});

const improvementMessage = computed(() => {
  if (!benchmarkComparison.value) return null;

  return getImprovementMessage(benchmarkComparison.value);
});

// Event handlers
const handlePeriodChange = async (period: TimePeriodType) => {
  setPeriod(period);
  await fetchAllData(period);
};

const handleCustomRangeChange = async (
  startDate: Date | null,
  endDate: Date | null
) => {
  if (startDate && endDate) {
    customStartDate.value = startDate;
    customEndDate.value = endDate;
    setCustomDateRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    await fetchAllData(
      undefined,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  }
};

const handleRefresh = async () => {
  await refresh();
};

const handleReset = async () => {
  customStartDate.value = null;
  customEndDate.value = null;
  resetToDefault();
  await fetchAllData();
};

// Initialize data on mount
onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
.change-failure-rate-section {
  @apply space-y-6;
}

.cfr-content-grid {
  @apply grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3;
}

.cfr-metric-card {
  @apply lg:col-span-1;
}

.cfr-trend-chart {
  @apply lg:col-span-1 xl:col-span-2;
}

.cfr-benchmarks {
  @apply lg:col-span-2 xl:col-span-1;
}

.metric-benchmark {
  @apply mt-2;
}

.benchmark-header {
  @apply p-4 pb-0;
}

.benchmark-title {
  @apply m-0 text-lg font-semibold text-gray-900;
}

.benchmark-subtitle {
  @apply mt-1 text-sm text-gray-600;
}

.benchmark-list {
  @apply space-y-3;
}

.benchmark-current {
  @apply ring-opacity-50 ring-2 ring-blue-500;
}

.benchmark-insights {
  @apply mt-4 space-y-2 border-t border-gray-200 pt-4;
}

.insight-item {
  @apply flex items-center justify-between text-sm;
}

.insight-label {
  @apply text-gray-600;
}

.insight-value {
  @apply font-medium text-gray-900 capitalize;
}

.improvement-message {
  @apply mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800;
}

.benchmark-source {
  @apply text-center text-xs text-gray-500;
}

.data-quality-warning,
.data-quality-info {
  @apply mt-4;
}

@media (max-width: 1024px) {
  .cfr-content-grid {
    @apply grid-cols-1;
  }

  .cfr-metric-card,
  .cfr-trend-chart,
  .cfr-benchmarks {
    @apply col-span-1;
  }
}
</style>
