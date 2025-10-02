<template>
  <aside
    class="sidebar"
    :class="[
      'fixed inset-y-0 left-0 z-30',
      'w-64 bg-white dark:bg-gray-800',
      'border-r border-gray-200 dark:border-gray-700',
      'transform transition-transform duration-300 ease-in-out',
      {
        'translate-x-0': isOpen || !isMobile,
        '-translate-x-full': !isOpen && isMobile,
        'md:translate-x-0': !isMobile,
        'md:static md:inset-auto': !isMobile,
      },
    ]"
    :data-testid="'sidebar'"
    role="navigation"
    :aria-label="'Main navigation'"
    :aria-hidden="!isOpen && isMobile"
  >
    <!-- Sidebar header -->
    <div
      class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        Navigation
      </h2>

      <!-- Close button for mobile -->
      <button
        v-if="isMobile"
        type="button"
        class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
        aria-label="Close navigation"
        data-testid="sidebar-close"
        @click="handleClose"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation items container with vertical scrolling -->
    <div
      class="sidebar-container flex-1 overflow-y-auto py-4"
      :class="[
        'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
        'scrollbar-track-gray-100 dark:scrollbar-track-gray-800',
      ]"
      data-testid="sidebar-container"
    >
      <nav class="space-y-1 px-2">
        <NavigationItem
          v-for="item in visibleItems"
          :key="item.id"
          :item="item"
          :auto-close="isMobile"
          @click="handleNavigationClick"
          @close="handleClose"
        />

        <!-- Empty state -->
        <div
          v-if="visibleItems.length === 0"
          class="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
          data-testid="empty-navigation"
        >
          <p>No navigation items available</p>
        </div>
      </nav>
    </div>

    <!-- Sidebar footer (optional) -->
    <div class="border-t border-gray-200 p-4 dark:border-gray-700">
      <slot name="footer" />
    </div>
  </aside>

  <!-- Mobile overlay -->
  <div
    v-if="isMobile && isOpen"
    class="bg-opacity-50 fixed inset-0 z-20 bg-black transition-opacity duration-300"
    data-testid="sidebar-overlay"
    @click="handleClose"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import NavigationItem from '~/components/atoms/NavigationItem.vue';
import type { NavigationItem as NavigationItemType } from '~/types/navigation';

/**
 * Sidebar component props interface
 */
export interface SidebarProps {
  /** Navigation items to display */
  navigationItems: NavigationItemType[];

  /** Whether the sidebar is open */
  isOpen: boolean;

  /** Whether the device is mobile */
  isMobile: boolean;

  /** Additional CSS classes */
  class?: string;
}

// Props with defaults
const props = withDefaults(defineProps<SidebarProps>(), {
  navigationItems: () => [],
  isOpen: false,
  isMobile: false,
  class: '',
});

// Emits
const emit = defineEmits<{
  /** Emitted when navigation item is clicked */
  'navigation-click': [item: NavigationItemType, event: MouseEvent];

  /** Emitted when sidebar should close */
  close: [];
}>();

// Computed properties
const visibleItems = computed(() =>
  props.navigationItems
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order)
);

// Event handlers
const handleNavigationClick = (item: NavigationItemType, event: MouseEvent) => {
  emit('navigation-click', item, event);

  // Auto-close on mobile
  if (props.isMobile) {
    handleClose();
  }
};

const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
@reference '~/assets/css/main.css';

/* Component-specific styles using Tailwind CSS utility classes */
.sidebar {
  @apply shadow-lg md:shadow-none;
}

/* Custom scrollbar styles */
.sidebar-container {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.300') theme('colors.gray.100');
}

.dark .sidebar-container {
  scrollbar-color: theme('colors.gray.600') theme('colors.gray.800');
}

/* Webkit scrollbar styles */
.sidebar-container::-webkit-scrollbar {
  @apply w-2;
}

.sidebar-container::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.sidebar-container::-webkit-scrollbar-thumb {
  @apply rounded-full bg-gray-300 dark:bg-gray-600;
}

.sidebar-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Smooth transitions for mobile */
.sidebar {
  @apply transition-transform duration-300 ease-in-out;
}

/* Ensure sidebar is above other content */
.sidebar {
  z-index: 30;
}

/* Mobile overlay */
.sidebar-overlay {
  z-index: 20;
}

/* Background color highlighting for active items */
.sidebar :deep(.navigation-item.bg-primary-100) {
  background-color: theme('colors.primary.100');
}

.dark .sidebar :deep(.navigation-item.bg-primary-100) {
  background-color: theme('colors.primary.900');
}
</style>
