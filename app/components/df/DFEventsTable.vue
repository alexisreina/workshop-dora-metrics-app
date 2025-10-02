<template>
  <table class="min-w-full text-sm text-gray-900 dark:text-gray-100" data-testid="df-events">
    <thead>
      <tr class="border-b text-left border-gray-200 dark:border-gray-700">
        <th class="px-3 py-2">Timestamp</th>
        <th class="px-3 py-2">Project</th>
        <th class="px-3 py-2">Repository</th>
        <th class="px-3 py-2">Environment</th>
        <th class="px-3 py-2">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="e in events" :key="e.id" class="border-b border-gray-200 dark:border-gray-800">
        <td class="px-3 py-2">{{ e.timestamp }}</td>
        <td class="px-3 py-2">{{ e.project }}</td>
        <td class="px-3 py-2">{{ e.repository }}</td>
        <td class="px-3 py-2">{{ e.environment }}</td>
        <td class="px-3 py-2">
          <span :class="e.status === 'success' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'">{{ e.status }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { DeploymentEvent } from '../../utils/df/types';

defineProps<{ events: DeploymentEvent[] }>();
</script>
