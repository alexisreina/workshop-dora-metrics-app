<template>
  <div class="grid grid-cols-2 gap-4 md:grid-cols-4" data-testid="df-summary">
    <div class="rounded bg-gray-100 p-3 dark:bg-gray-800">
      <div class="text-xs text-gray-500 dark:text-gray-300">Total Production Successes</div>
      <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {{ summary?.totalProductionSuccesses ?? 0 }}
      </div>
    </div>
    <div class="rounded bg-gray-100 p-3 dark:bg-gray-800">
      <div class="text-xs text-gray-500 dark:text-gray-300">Average per bucket</div>
      <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {{ (summary?.averagePerBucket ?? 0).toFixed(2) }}
      </div>
    </div>
    <div class="rounded bg-gray-100 p-3 dark:bg-gray-800">
      <div class="text-xs text-gray-500 dark:text-gray-300">Previous period delta</div>
      <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {{ summary?.previousPeriodDelta ?? 0 }}
      </div>
    </div>
    <div class="rounded bg-gray-100 p-3 dark:bg-gray-800">
      <div class="text-xs text-gray-500 dark:text-gray-300">Previous period % change</div>
      <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {{ (summary?.previousPeriodPercentChange ?? 0).toFixed(1) }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeploymentSummary } from '../../utils/df/types';

defineProps<{ summary: DeploymentSummary | null }>();
</script>
