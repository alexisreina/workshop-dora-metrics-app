<template>
  <div class="grid grid-cols-2 gap-4 md:grid-cols-4" data-testid="df-summary">
    <div class="rounded bg-gray-100 p-3">
      <div class="text-xs text-gray-500">Total Production Successes</div>
      <div class="text-2xl font-semibold">
        {{ summary?.totalProductionSuccesses ?? 0 }}
      </div>
    </div>
    <div class="rounded bg-gray-100 p-3">
      <div class="text-xs text-gray-500">Average per bucket</div>
      <div class="text-2xl font-semibold">
        {{ (summary?.averagePerBucket ?? 0).toFixed(2) }}
      </div>
    </div>
    <div class="rounded bg-gray-100 p-3">
      <div class="text-xs text-gray-500">Previous period delta</div>
      <div class="text-2xl font-semibold">
        {{ summary?.previousPeriodDelta ?? 0 }}
      </div>
    </div>
    <div class="rounded bg-gray-100 p-3">
      <div class="text-xs text-gray-500">Previous period % change</div>
      <div class="text-2xl font-semibold">
        {{ (summary?.previousPeriodPercentChange ?? 0).toFixed(1) }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeploymentSummary } from '~/utils/df/types';

defineProps<{ summary: DeploymentSummary | null }>();
</script>
