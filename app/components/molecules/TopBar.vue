<template>
  <header
    class="top-bar border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
    :class="[
      'sticky top-0 z-40',
      'flex items-center justify-between',
      'px-4 py-3 md:px-6',
      'h-16',
    ]"
    data-testid="top-bar"
    role="banner"
  >
    <!-- Left section: Logo and App Name -->
    <div class="flex items-center">
      <!-- Mobile hamburger menu -->
      <button
        v-if="isMobile"
        type="button"
        class="hamburger-menu"
        :class="[
          'mr-3 rounded-md p-2',
          'text-gray-400 hover:bg-gray-100 hover:text-gray-500',
          'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200',
          'focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 focus:outline-none',
          'flex min-h-[44px] min-w-[44px] items-center justify-center',
        ]"
        :aria-label="
          isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'
        "
        :aria-expanded="isSidebarOpen"
        data-testid="hamburger-menu"
        @click="handleToggleSidebar"
      >
        <!-- Hamburger icon -->
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            v-if="!isSidebarOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- App Logo -->
      <AppLogo
        :app-name="appName"
        :logo-url="logoUrl"
        class="flex-shrink-0"
        @click="handleLogoClick"
      />
    </div>

    <!-- Right section: Additional actions (future use) -->
    <div class="flex items-center space-x-4">
      <!-- Slot for additional top bar content -->
      <slot name="actions" />

      <!-- Theme toggle placeholder -->
      <div class="hidden md:block">
        <!-- Future: Theme toggle, user menu, etc. -->
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import AppLogo from '~/components/atoms/AppLogo.vue';

/**
 * TopBar component props interface
 */
export interface TopBarProps {
  /** Application name */
  appName: string;

  /** Optional logo URL */
  logoUrl?: string;

  /** Whether the device is mobile */
  isMobile: boolean;

  /** Whether the sidebar is open (mobile) */
  isSidebarOpen: boolean;

  /** Additional CSS classes */
  class?: string;
}

// Props with defaults
const props = withDefaults(defineProps<TopBarProps>(), {
  appName: 'DORA Metrics App',
  isSidebarOpen: false,
  class: '',
});

// Emits
const emit = defineEmits<{
  /** Emitted when hamburger menu is clicked */
  'toggle-sidebar': [];

  /** Emitted when logo is clicked */
  'logo-click': [event: MouseEvent];
}>();

// Event handlers
const handleToggleSidebar = () => {
  emit('toggle-sidebar');
};

const handleLogoClick = (event: MouseEvent) => {
  emit('logo-click', event);
};
</script>

<style scoped>
@reference '~/assets/css/main.css';

/* Component-specific styles using Tailwind CSS utility classes */
.top-bar {
  @apply sticky top-0 z-40 bg-white dark:bg-gray-800;
  backdrop-filter: blur(8px);
}

.hamburger-menu {
  @apply transition-all duration-200;
}

.hamburger-menu:hover {
  @apply scale-105;
}

.hamburger-menu:active {
  @apply scale-95;
}

/* Ensure minimum touch target size on mobile */
@media (max-width: 768px) {
  .hamburger-menu {
    @apply min-h-[44px] min-w-[44px];
  }
}

/* Smooth transitions for responsive changes */
.top-bar * {
  @apply transition-colors duration-200;
}
</style>
