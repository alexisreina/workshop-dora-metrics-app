<template>
  <div class="benchmark-indicator" :class="colorClass">
    <div class="benchmark-icon">
      {{ icon }}
    </div>
    <div class="benchmark-content">
      <div class="benchmark-category">
        {{ categoryLabel }}
      </div>
      <div v-if="range" class="benchmark-range">
        {{ range }}
      </div>
      <div v-if="description" class="benchmark-description">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BenchmarkData } from '~/types/common';
import { BenchmarkCategory } from '~/types/enums';
import { useBenchmarkComparison } from '~/composables/useBenchmarkComparison';

interface Props {
  benchmark: BenchmarkData;
  showRange?: boolean;
  showDescription?: boolean;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showRange: true,
  showDescription: true,
  compact: false,
});

const { getBenchmarkColor, getBenchmarkIcon, formatBenchmarkRange } =
  useBenchmarkComparison();

const categoryLabel = computed(() => {
  return (
    props.benchmark.category.charAt(0).toUpperCase() +
    props.benchmark.category.slice(1)
  );
});

const icon = computed(() => {
  return getBenchmarkIcon(props.benchmark.category);
});

const colorClass = computed(() => {
  const baseClasses = getBenchmarkColor(props.benchmark.category);
  return `${baseClasses} ${props.compact ? 'benchmark-indicator--compact' : ''}`;
});

const range = computed(() => {
  return props.showRange ? formatBenchmarkRange(props.benchmark) : null;
});

const description = computed(() => {
  return props.showDescription && !props.compact
    ? props.benchmark.description
    : null;
});
</script>

<style scoped>
.benchmark-indicator {
  @apply flex items-start gap-3 rounded-lg border p-3;
}

.benchmark-indicator--compact {
  @apply gap-2 p-2;
}

.benchmark-icon {
  @apply flex-shrink-0 text-lg;
}

.benchmark-content {
  @apply min-w-0 flex-1;
}

.benchmark-category {
  @apply text-sm font-semibold;
}

.benchmark-range {
  @apply mt-0.5 text-xs opacity-75;
}

.benchmark-description {
  @apply mt-1 text-xs leading-relaxed opacity-90;
}

.benchmark-indicator--compact .benchmark-category {
  @apply text-xs;
}

.benchmark-indicator--compact .benchmark-range {
  @apply text-xs;
}
</style>
