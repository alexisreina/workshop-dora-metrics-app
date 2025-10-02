<template>
  <div class="flex items-center" data-testid="app-logo">
    <!-- Logo image (if provided) -->
    <img
      v-if="logoUrl"
      :src="logoUrl"
      :alt="logoAlt"
      :width="logoWidth"
      :height="logoHeight"
      class="mr-2"
      data-testid="logo-image"
    />

    <!-- App name -->
    <span
      class="text-xl font-bold text-gray-900 dark:text-white"
      data-testid="app-name"
    >
      {{ appName }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { AppBranding, LogoConfig } from '~/types/branding';

/**
 * AppLogo component props interface
 */
export interface AppLogoProps {
  /** Application name to display */
  appName: string;

  /** Optional logo image URL */
  logoUrl?: string;

  /** Logo alt text for accessibility */
  logoAlt?: string;

  /** Logo width in pixels */
  logoWidth?: number;

  /** Logo height in pixels */
  logoHeight?: number;

  /** Additional CSS classes */
  class?: string;
}

// Props with defaults
const props = withDefaults(defineProps<AppLogoProps>(), {
  appName: 'DORA Metrics App',
  logoAlt: 'App Logo',
  logoWidth: 32,
  logoHeight: 32,
  class: '',
});

// Emits
const emit = defineEmits<{
  /** Emitted when logo is clicked */
  click: [event: MouseEvent];
}>();

// Event handlers
const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style scoped>
@reference '~/assets/css/main.css';

/* Component-specific styles using Tailwind CSS utility classes */
.app-logo {
  @apply flex cursor-pointer items-center;
}

.app-logo:hover .app-name {
  @apply text-primary-600;
}

.logo-image {
  @apply transition-transform duration-200 hover:scale-105;
}
</style>
