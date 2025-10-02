<template>
  <div class="space-y-4 p-4">
    <DFFilters v-model="selection" />

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded bg-white p-4 shadow md:col-span-2">
        <DFChart :series="series" />
      </div>
      <div class="rounded bg-white p-4 shadow">
        <DFSummary :summary="summary" />
      </div>
    </div>

    <div class="rounded bg-white p-4 shadow">
      <DFEventsTable :events="events" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DFFilters from '~/components/df/DFFilters.vue';
import DFChart from '~/components/df/DFChart.vue';
import DFSummary from '~/components/df/DFSummary.vue';
import DFEventsTable from '~/components/df/DFEventsTable.vue';
import { useDfSelection } from '~/composables/df/useDfSelection';
import { useDeploymentFrequency } from '~/composables/df/useDeploymentFrequency';

const { fetchSeries, fetchSummary, fetchEvents } = useDeploymentFrequency();
const selection = reactive({
  preset: '6m',
  groupBy: 'day',
  startDate: undefined as string | undefined,
  endDate: undefined as string | undefined,
  project: 'All' as string | undefined,
  repository: 'All' as string | undefined,
  environment: 'All' as string | undefined,
  rollingAvg: false,
});

const series = ref(null as any);
const summary = ref(null as any);
const events = ref([] as any[]);

async function load() {
  series.value = await fetchSeries(selection as any);
  summary.value = await fetchSummary(selection as any);
  events.value = await fetchEvents(selection as any);
}

watch(selection, () => {
  load();
});

onMounted(load);
</script>
