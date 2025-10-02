<template>
  <NuxtLink
    :to="item.route"
    class="navigation-item"
    :class="[
      'block rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200',
      'hover:bg-gray-100 dark:hover:bg-gray-700',
      'focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 focus:outline-none',
      {
        'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300':
          item.isActive,
        'text-gray-700 dark:text-gray-300': !item.isActive,
        hidden: !item.isVisible,
      },
    ]"
    :data-testid="`navigation-item-${item.id}`"
    :aria-current="item.isActive ? 'page' : undefined"
    @click="handleClick"
    @keydown.enter="handleKeydown"
  >
    <span class="flex items-center">
      <!-- Optional icon slot -->
      <slot name="icon" />

      <!-- Navigation item label -->
      <span class="flex-1" data-testid="navigation-item-label">
        {{ item.label }}
      </span>

      <!-- Active indicator -->
      <span
        v-if="item.isActive"
        class="bg-primary-500 ml-2 h-2 w-2 rounded-full"
        data-testid="active-indicator"
        aria-hidden="true"
      />
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation';

/**
 * NavigationItem component props interface
 */
export interface NavigationItemProps {
  /** Navigation item data */
  item: NavigationItem;

  /** Whether to auto-close sidebar on click (mobile) */
  autoClose?: boolean;

  /** Additional CSS classes */
  class?: string;
}

// Props with defaults
const props = withDefaults(defineProps<NavigationItemProps>(), {
  autoClose: true,
  class: '',
});

// Emits
const emit = defineEmits<{
  /** Emitted when navigation item is clicked */
  click: [item: NavigationItem, event: MouseEvent];

  /** Emitted when navigation should close (mobile) */
  close: [];
}>();

// Event handlers
const handleClick = (event: MouseEvent) => {
  emit('click', props.item, event);

  // Auto-close sidebar on mobile if enabled
  if (props.autoClose) {
    emit('close');
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleClick(event as unknown as MouseEvent);
  }
};
</script>

<style scoped>
@reference '~/assets/css/main.css';

/* Component-specific styles using Tailwind CSS utility classes */
.navigation-item {
  @apply relative;
}

/* Active state background color highlighting */
.navigation-item.bg-primary-100 {
  background-color: theme('colors.primary.100');
}

.dark .navigation-item.bg-primary-100 {
  background-color: theme('colors.primary.900');
}

/* Hover state with smooth transitions */
.navigation-item:hover {
  @apply scale-105 transform;
}

/* Focus state for accessibility */
.navigation-item:focus {
  @apply ring-primary-500 ring-2 ring-offset-2;
}

/* Mobile touch targets (minimum 44px) */
@media (max-width: 768px) {
  .navigation-item {
    @apply flex min-h-[44px] items-center;
  }
}
</style>
