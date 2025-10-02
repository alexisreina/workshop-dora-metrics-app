<template>
  <div class="metric-value" :class="sizeClass">
    <div class="metric-number" :class="colorClass">
      {{ formattedValue }}
      <span v-if="unit" class="metric-unit">{{ unit }}</span>
    </div>
    <div v-if="label" class="metric-label">
      {{ label }}
    </div>
    <div v-if="subtitle" class="metric-subtitle">
      {{ subtitle }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number;
  unit?: string;
  label?: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  precision?: number;
}

const props = withDefaults(defineProps<Props>(), {
  unit: '%',
  size: 'medium',
  variant: 'default',
  precision: 0,
});

const formattedValue = computed(() => {
  return props.value.toFixed(props.precision);
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'metric-value--small';
    case 'large':
      return 'metric-value--large';
    default:
      return 'metric-value--medium';
  }
});

const colorClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'danger':
      return 'text-red-600';
    default:
      return 'text-gray-900';
  }
});
</script>

<style scoped>
.metric-value {
  @apply text-center;
}

.metric-number {
  @apply leading-none font-bold;
}

.metric-unit {
  @apply ml-1 text-sm opacity-75;
}

.metric-label {
  @apply mt-1 text-sm font-medium text-gray-700;
}

.metric-subtitle {
  @apply mt-0.5 text-xs text-gray-500;
}

.metric-value--small .metric-number {
  @apply text-lg;
}

.metric-value--small .metric-label {
  @apply text-xs;
}

.metric-value--medium .metric-number {
  @apply text-3xl;
}

.metric-value--large .metric-number {
  @apply text-5xl;
}

.metric-value--large .metric-label {
  @apply text-base;
}
</style>
