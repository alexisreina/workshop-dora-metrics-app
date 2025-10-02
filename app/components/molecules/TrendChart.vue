<template>
  <div class="trend-chart">
    <div v-if="title" class="trend-chart-header">
      <h4 class="trend-chart-title">{{ title }}</h4>
      <div v-if="subtitle" class="trend-chart-subtitle">{{ subtitle }}</div>
    </div>

    <div class="trend-chart-container">
      <Chart
        v-if="!loading && !error && chartData"
        type="line"
        :data="chartData"
        :options="chartOptions"
        class="trend-chart-canvas"
      />

      <div v-else-if="loading" class="trend-chart-loading">
        <ProgressSpinner size="small" />
        <span class="loading-text">Loading chart data...</span>
      </div>

      <div v-else-if="error" class="trend-chart-error">
        <i class="pi pi-exclamation-triangle error-icon"></i>
        <span class="error-text">{{ error }}</span>
      </div>

      <div v-else-if="!data || data.length === 0" class="trend-chart-empty">
        <i class="pi pi-chart-line empty-icon"></i>
        <span class="empty-text">No data available</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart';
import ProgressSpinner from 'primevue/progressspinner';
import type { HistoricalDataPoint } from '~/types/metrics';

interface Props {
  title?: string;
  subtitle?: string;
  data?: HistoricalDataPoint[];
  loading?: boolean;
  error?: string;
  height?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: '300px',
  showGrid: true,
  showLegend: false,
  color: '#3B82F6',
});

const chartData = computed(() => {
  if (!props.data || props.data.length === 0) return null;

  return {
    labels: props.data.map((point) => {
      const date = new Date(point.date);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }),
    datasets: [
      {
        label: 'Change Failure Rate',
        data: props.data.map((point) => point.value),
        borderColor: props.color,
        backgroundColor: props.color + '20',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: props.color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
});

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: props.showLegend,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const dataPoint = props.data?.[context.dataIndex];
            if (!dataPoint) return '';

            return [
              `Failure Rate: ${context.parsed.y}%`,
              `Total Deployments: ${dataPoint.totalDeployments}`,
              `Failed Deployments: ${dataPoint.failedDeployments}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: props.showGrid,
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        max: 100,
        grid: {
          display: props.showGrid,
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
          callback: (value: any) => `${value}%`,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
      },
    },
  };
});
</script>

<style scoped>
.trend-chart {
  @apply w-full;
}

.trend-chart-header {
  @apply mb-4;
}

.trend-chart-title {
  @apply m-0 text-base font-semibold text-gray-900;
}

.trend-chart-subtitle {
  @apply mt-1 text-sm text-gray-600;
}

.trend-chart-container {
  @apply relative;
  height: v-bind(height);
}

.trend-chart-canvas {
  @apply h-full w-full;
}

.trend-chart-loading,
.trend-chart-error,
.trend-chart-empty {
  @apply flex h-full flex-col items-center justify-center text-gray-500;
}

.loading-text,
.error-text,
.empty-text {
  @apply mt-2 text-sm;
}

.error-icon,
.empty-icon {
  @apply text-2xl;
}

.trend-chart-error {
  @apply text-red-500;
}
</style>
