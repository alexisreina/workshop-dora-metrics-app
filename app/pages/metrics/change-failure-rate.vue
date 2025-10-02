<template>
  <div class="change-failure-rate-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Change Failure Rate</h1>
          <p class="page-description">
            Track the percentage of deployments that result in degraded service
            requiring remediation. A key DORA metric for measuring deployment
            quality and reliability.
          </p>
        </div>

        <div class="header-actions">
          <Button
            icon="pi pi-question-circle"
            severity="secondary"
            text
            @click="showHelp = true"
          />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <ChangeFailureRateSection />
    </div>

    <!-- Help Dialog -->
    <Dialog
      v-model:visible="showHelp"
      header="About Change Failure Rate"
      modal
      class="help-dialog"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div class="help-content">
        <div class="help-section">
          <h3 class="help-section-title">What is Change Failure Rate?</h3>
          <p class="help-text">
            Change Failure Rate measures the percentage of deployments that
            result in degraded service and require remediation (e.g., hotfix,
            rollback, patch). It's one of the four key DORA metrics that
            indicate software delivery performance.
          </p>
        </div>

        <div class="help-section">
          <h3 class="help-section-title">How is it calculated?</h3>
          <p class="help-text">
            <strong
              >Change Failure Rate = (Failed Deployments / Total Deployments) ×
              100</strong
            >
          </p>
          <p class="help-text">
            A deployment is considered failed if it causes production issues
            that require immediate remediation within 24 hours of deployment.
          </p>
        </div>

        <div class="help-section">
          <h3 class="help-section-title">Performance Benchmarks</h3>
          <div class="benchmark-help-list">
            <div class="benchmark-help-item">
              <span class="benchmark-help-category elite">Elite (0-5%)</span>
              <span class="benchmark-help-description"
                >Exceptional deployment quality</span
              >
            </div>
            <div class="benchmark-help-item">
              <span class="benchmark-help-category high">High (6-10%)</span>
              <span class="benchmark-help-description"
                >Good deployment practices</span
              >
            </div>
            <div class="benchmark-help-item">
              <span class="benchmark-help-category medium"
                >Medium (11-20%)</span
              >
              <span class="benchmark-help-description"
                >Room for improvement</span
              >
            </div>
            <div class="benchmark-help-item">
              <span class="benchmark-help-category low">Low (21%+)</span>
              <span class="benchmark-help-description"
                >Needs significant improvement</span
              >
            </div>
          </div>
        </div>

        <div class="help-section">
          <h3 class="help-section-title">Improving Your Rate</h3>
          <ul class="help-list">
            <li>Implement comprehensive automated testing</li>
            <li>Use feature flags for safer deployments</li>
            <li>Improve monitoring and alerting systems</li>
            <li>Practice deployment automation and standardization</li>
            <li>Conduct thorough code reviews</li>
            <li>Implement gradual rollout strategies</li>
          </ul>
        </div>
      </div>

      <template #footer>
        <Button label="Got it" severity="primary" @click="showHelp = false" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ChangeFailureRateSection from '~/components/organisms/ChangeFailureRateSection.vue';

// Meta tags for SEO
useHead({
  title: 'Change Failure Rate - DORA Metrics',
  meta: [
    {
      name: 'description',
      content:
        'Track your Change Failure Rate, a key DORA metric measuring deployment quality and reliability. Compare against industry benchmarks and identify improvement opportunities.',
    },
    {
      name: 'keywords',
      content:
        'DORA metrics, change failure rate, deployment quality, software delivery, DevOps metrics',
    },
  ],
});

// Reactive state
const showHelp = ref(false);

// Performance monitoring
onMounted(() => {
  // Track page load performance
  const startTime = performance.now();

  nextTick(() => {
    const loadTime = performance.now() - startTime;
    console.log(`Change Failure Rate page loaded in ${loadTime.toFixed(2)}ms`);

    // Ensure we meet the <200ms requirement
    if (loadTime > 200) {
      console.warn(
        `Page load time (${loadTime.toFixed(2)}ms) exceeds 200ms target`
      );
    }
  });
});
</script>

<style scoped>
.change-failure-rate-page {
  @apply min-h-screen bg-gray-50;
}

.page-header {
  @apply border-b border-gray-200 bg-white;
}

.header-content {
  @apply mx-auto flex max-w-7xl items-start justify-between px-4 py-6 sm:px-6 lg:px-8;
}

.header-text {
  @apply flex-1;
}

.page-title {
  @apply m-0 text-3xl font-bold text-gray-900;
}

.page-description {
  @apply mt-2 max-w-3xl text-lg text-gray-600;
}

.header-actions {
  @apply ml-4 flex items-center gap-2;
}

.page-content {
  @apply mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8;
}

.help-content {
  @apply space-y-6;
}

.help-section {
  @apply space-y-3;
}

.help-section-title {
  @apply m-0 text-lg font-semibold text-gray-900;
}

.help-text {
  @apply leading-relaxed text-gray-700;
}

.benchmark-help-list {
  @apply space-y-2;
}

.benchmark-help-item {
  @apply flex items-center justify-between rounded border p-2;
}

.benchmark-help-category {
  @apply rounded px-2 py-1 text-sm font-medium;
}

.benchmark-help-category.elite {
  @apply bg-green-100 text-green-800;
}

.benchmark-help-category.high {
  @apply bg-blue-100 text-blue-800;
}

.benchmark-help-category.medium {
  @apply bg-yellow-100 text-yellow-800;
}

.benchmark-help-category.low {
  @apply bg-red-100 text-red-800;
}

.benchmark-help-description {
  @apply text-sm text-gray-600;
}

.help-list {
  @apply list-inside list-disc space-y-1 text-gray-700;
}

.help-dialog {
  @apply max-h-screen overflow-y-auto;
}

@media (max-width: 768px) {
  .header-content {
    @apply flex-col items-start gap-4;
  }

  .header-actions {
    @apply ml-0;
  }

  .page-title {
    @apply text-2xl;
  }

  .page-description {
    @apply text-base;
  }
}
</style>
