<template>
  <DefaultLayout>
    <!-- Metrics Page Content -->
    <div class="metrics-page mx-auto max-w-6xl">
      <!-- Page Header -->
      <div class="mb-8">
        <h1
          class="mb-4 text-3xl font-bold text-gray-900 dark:text-white"
          data-testid="metrics-title"
        >
          {{ pageTitle }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          {{ pageDescription }}
        </p>
      </div>

      <!-- Metrics Content -->
      <div v-if="isDeploymentFrequency" class="space-y-4 p-4">
        <DFFilters v-model="selection" />

        <div class="grid gap-4 md:grid-cols-3">
          <div
            class="rounded bg-white p-4 shadow md:col-span-2 dark:bg-gray-900"
          >
            <DFChart :series="series" />
          </div>
          <div class="rounded bg-white p-4 shadow dark:bg-gray-900">
            <DFSummary :summary="summary" />
          </div>
        </div>

        <div class="rounded bg-white p-4 shadow dark:bg-gray-900">
          <DFEventsTable :events="events" />
        </div>
      </div>

      <div
        v-else
        class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="text-center">
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
          >
            <svg
              class="h-8 w-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>

          <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Coming Soon
          </h2>

          <p class="text-gray-600 dark:text-gray-300">
            This metrics section is under development. Check back soon for
            detailed insights and analytics.
          </p>

          <div class="mt-6">
            <NuxtLink
              to="/"
              class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex items-center rounded-lg px-4 py-2 text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <svg
                class="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Welcome
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { useDeploymentFrequency } from '../../composables/df/useDeploymentFrequency';

// Get route parameters
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const isDeploymentFrequency = computed(() => slug.value === '1');

// DF state and loading
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

async function loadDf() {
  if (!isDeploymentFrequency.value) return;
  series.value = await fetchSeries(selection as any);
  summary.value = await fetchSummary(selection as any);
  events.value = await fetchEvents(selection as any);
}

watch(selection, () => {
  loadDf();
});

watch(
  () => isDeploymentFrequency.value,
  (now) => {
    if (now) loadDf();
  },
  { immediate: true }
);

// Page metadata based on slug
const pageTitle = computed(() => {
  switch (slug.value) {
    case '1':
      return 'Deployment Frequency';
    case '2':
      return 'Lead Time for Changes';
    case '3':
      return 'Mean Time to Recovery';
    case '4':
      return 'Change Failure Rate';
    default:
      return `Metrics ${slug.value}`;
  }
});

const pageDescription = computed(() => {
  switch (slug.value) {
    case '1':
      return 'Track how often your team deploys code to production or releases to end users.';
    case '2':
      return 'Measure the time it takes for a commit to get into production.';
    case '3':
      return 'Monitor how long it takes to recover from a failure in production.';
    case '4':
      return 'Analyze the percentage of deployments causing a failure in production.';
    default:
      return `Detailed metrics and analytics for ${pageTitle.value}.`;
  }
});

// Set page metadata
useHead({
  title: `${pageTitle.value} - DORA Metrics App`,
  meta: [
    {
      name: 'description',
      content: pageDescription.value,
    },
  ],
});
</script>

<style scoped>
@reference '~/assets/css/main.css';

/* Component-specific styles using Tailwind CSS utility classes */
.metrics-page {
  @apply mx-auto max-w-6xl;
}

/* Animation for the metrics content */
.metrics-page > div {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects */
.metrics-page a:hover {
  @apply scale-105 transform;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .metrics-page {
    @apply max-w-full px-4;
  }
}
</style>
