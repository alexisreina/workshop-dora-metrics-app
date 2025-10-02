<template>
  <NavigationLayout>
    <!-- Welcome Page Content -->
    <div class="welcome-page mx-auto max-w-4xl">
      <!-- Hero Section -->
      <div class="mb-12 text-center">
        <h1
          class="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white"
          data-testid="welcome-title"
        >
          Welcome to DORA Metrics
        </h1>

        <p
          class="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-300"
          data-testid="welcome-description"
        >
          {{ welcomeContent.description }}
        </p>
      </div>

      <!-- DORA Metrics Overview -->
      <div class="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="metric in doraMetrics"
          :key="metric.id"
          class="metric-card rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          :data-testid="`metric-card-${metric.id}`"
        >
          <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            {{ metric.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ metric.description }}
          </p>
        </div>
      </div>

      <!-- Features Section -->
      <div
        class="mb-12 rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <h2
          class="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white"
        >
          Key Features
        </h2>

        <div class="grid gap-6 md:grid-cols-3">
          <div
            v-for="(feature, index) in welcomeContent.features"
            :key="index"
            class="feature-item text-center"
            :data-testid="`feature-${index}`"
          >
            <div
              class="bg-primary-100 dark:bg-primary-900 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
            >
              <svg
                class="text-primary-600 dark:text-primary-400 h-6 w-6"
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
            <p class="text-gray-600 dark:text-gray-300">{{ feature }}</p>
          </div>
        </div>
      </div>

      <!-- Getting Started Section -->
      <div class="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800/50">
        <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Getting Started
        </h2>
        <p class="mx-auto mb-6 max-w-2xl text-gray-600 dark:text-gray-300">
          Use the navigation menu to explore different metrics sections. Each
          section provides detailed insights into your DevOps performance.
        </p>

        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            v-for="item in availableMetrics"
            :key="item.id"
            :to="item.route"
            class="metric-link"
            :class="[
              'inline-flex items-center rounded-lg px-6 py-3',
              'bg-primary-600 hover:bg-primary-700 text-white',
              'transition-colors duration-200',
              'focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 focus:outline-none',
            ]"
            :data-testid="`metric-link-${item.id}`"
          >
            {{ item.label }}
            <svg
              class="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </NavigationLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import NavigationLayout from '~/components/organisms/NavigationLayout.vue';
import { useNavigation } from '~/composables/useNavigation';
import type { WelcomeContent, DoraMetricsInfo } from '~/types/content';

// Page metadata
useHead({
  title: 'Welcome to DORA Metrics',
  meta: [
    {
      name: 'description',
      content:
        'DORA Metrics application for measuring and improving DevOps performance through key metrics like deployment frequency, lead time, MTTR, and change failure rate.',
    },
  ],
});

// Composables
const navigation = useNavigation();

// Welcome content data
const welcomeContent: WelcomeContent = {
  title: 'Welcome to DORA Metrics',
  description:
    'DORA metrics help teams measure and improve their DevOps performance through four key metrics that provide insights into deployment frequency, lead time, recovery time, and change failure rates.',
  features: [
    'Track deployment frequency and velocity',
    'Monitor lead time for changes',
    'Measure mean time to recovery',
    'Analyze change failure rates',
    'Visualize performance trends',
    'Generate actionable insights',
  ],
};

// DORA metrics information
const doraMetrics: DoraMetricsInfo[] = [
  {
    id: 'deployment-frequency',
    name: 'Deployment Frequency',
    description:
      'How often your team deploys code to production or releases to end users.',
  },
  {
    id: 'lead-time',
    name: 'Lead Time for Changes',
    description: 'The time it takes for a commit to get into production.',
  },
  {
    id: 'mttr',
    name: 'Mean Time to Recovery',
    description: 'How long it takes to recover from a failure in production.',
  },
  {
    id: 'change-failure-rate',
    name: 'Change Failure Rate',
    description:
      'The percentage of deployments causing a failure in production.',
  },
];

// Computed properties
const availableMetrics = computed(() =>
  navigation.navigationItems.value.filter((item) => item.isVisible)
);
</script>

<style scoped>
@reference '~/assets/css/main.css';

/* Component-specific styles using Tailwind CSS utility classes */
.welcome-page {
  @apply space-y-8;
}

.metric-card {
  @apply transition-all duration-200 hover:scale-105 hover:shadow-md;
}

.metric-card:hover {
  @apply border-primary-200 dark:border-primary-700;
}

.feature-item {
  @apply transition-transform duration-200 hover:scale-105;
}

.metric-link {
  @apply transform transition-all duration-200;
}

.metric-link:hover {
  @apply scale-105 shadow-lg;
}

.metric-link:active {
  @apply scale-95;
}

/* Responsive typography */
@media (max-width: 768px) {
  .welcome-page h1 {
    @apply text-3xl;
  }

  .welcome-page .text-xl {
    @apply text-lg;
  }
}

/* Dark mode enhancements */
.dark .metric-card {
  @apply border-gray-700 bg-gray-800;
}

.dark .metric-card:hover {
  @apply border-primary-600;
}

/* Animation for metric cards */
.metric-card {
  animation: fadeInUp 0.6s ease-out;
}

.metric-card:nth-child(1) {
  animation-delay: 0.1s;
}
.metric-card:nth-child(2) {
  animation-delay: 0.2s;
}
.metric-card:nth-child(3) {
  animation-delay: 0.3s;
}
.metric-card:nth-child(4) {
  animation-delay: 0.4s;
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
</style>
