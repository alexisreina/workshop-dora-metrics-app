<template>
  <Card class="metric-card" :class="cardClass">
    <template #header>
      <div v-if="title" class="metric-card-header">
        <h3 class="metric-card-title">{{ title }}</h3>
        <div v-if="subtitle" class="metric-card-subtitle">{{ subtitle }}</div>
      </div>
    </template>

    <template #content>
      <div class="metric-card-content">
        <MetricValue
          :value="value"
          :unit="unit"
          :label="label"
          :subtitle="metricSubtitle"
          :size="size"
          :variant="variant"
          :precision="precision"
        />

        <div v-if="supportingData.length > 0" class="metric-supporting-data">
          <div
            v-for="data in supportingData"
            :key="data.label"
            class="supporting-data-item"
          >
            <span class="supporting-data-label">{{ data.label }}:</span>
            <span class="supporting-data-value">{{ data.value }}</span>
          </div>
        </div>

        <div v-if="trend" class="metric-trend" :class="trendClass">
          <i :class="trendIcon" class="trend-icon"></i>
          <span class="trend-text">{{ trendText }}</span>
        </div>
      </div>
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import MetricValue from '~/components/atoms/MetricValue.vue';

interface SupportingData {
  label: string;
  value: string | number;
}

interface Props {
  title?: string;
  subtitle?: string;
  value: number;
  unit?: string;
  label?: string;
  metricSubtitle?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  precision?: number;
  supportingData?: SupportingData[];
  trend?: 'improving' | 'degrading' | 'stable';
  loading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  unit: '%',
  size: 'medium',
  variant: 'default',
  precision: 0,
  supportingData: () => [],
  loading: false,
});

const cardClass = computed(() => {
  const classes = ['h-full'];

  if (props.loading) {
    classes.push('metric-card--loading');
  }

  if (props.error) {
    classes.push('metric-card--error');
  }

  return classes.join(' ');
});

const trendClass = computed(() => {
  switch (props.trend) {
    case 'improving':
      return 'text-green-600';
    case 'degrading':
      return 'text-red-600';
    default:
      return 'text-gray-500';
  }
});

const trendIcon = computed(() => {
  switch (props.trend) {
    case 'improving':
      return 'pi pi-arrow-down';
    case 'degrading':
      return 'pi pi-arrow-up';
    default:
      return 'pi pi-minus';
  }
});

const trendText = computed(() => {
  switch (props.trend) {
    case 'improving':
      return 'Improving';
    case 'degrading':
      return 'Degrading';
    default:
      return 'Stable';
  }
});
</script>

<style scoped>
.metric-card {
  @apply shadow-sm transition-shadow duration-200 hover:shadow-md;
}

.metric-card--loading {
  @apply pointer-events-none opacity-75;
}

.metric-card--error {
  @apply border-red-200 bg-red-50;
}

.metric-card-header {
  @apply p-4 pb-0;
}

.metric-card-title {
  @apply m-0 text-lg font-semibold text-gray-900;
}

.metric-card-subtitle {
  @apply mt-1 text-sm text-gray-600;
}

.metric-card-content {
  @apply space-y-4;
}

.metric-supporting-data {
  @apply grid grid-cols-2 gap-2 text-sm;
}

.supporting-data-item {
  @apply flex items-center justify-between;
}

.supporting-data-label {
  @apply text-gray-600;
}

.supporting-data-value {
  @apply font-medium text-gray-900;
}

.metric-trend {
  @apply flex items-center justify-center gap-2 text-sm font-medium;
}

.trend-icon {
  @apply text-xs;
}

.trend-text {
  @apply capitalize;
}
</style>
