<template>
  <div
    class="default-layout flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900"
    data-testid="default-layout"
  >
    <!-- Top Bar -->
    <TopBar
      :app-name="appName"
      :logo-url="logoUrl"
      :is-mobile="isMobile"
      :is-sidebar-open="isSidebarOpen"
      @toggle-sidebar="handleToggleSidebar"
      @logo-click="handleLogoClick"
    />

    <!-- Main Content Area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar
        :navigation-items="navigationItems"
        :is-open="isSidebarOpen"
        :is-mobile="isMobile"
        @navigation-click="handleNavigationClick"
        @close="handleCloseSidebar"
      />

      <!-- Main Content -->
      <main
        class="main-content flex-1 overflow-auto"
        :class="[
          'p-4 md:p-6',
          {
            'md:ml-64': !isMobile,
            'ml-0': isMobile,
          },
        ]"
        role="main"
        data-testid="main-content"
      >
        <!-- Page Content Slot -->
        <slot />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="isMobile && isSidebarOpen"
      class="bg-opacity-50 fixed inset-0 z-20 bg-black transition-opacity duration-300"
      data-testid="mobile-overlay"
      @click="handleCloseSidebar"
    />

    <!-- Notifications -->
    <div
      v-if="notifications.length > 0"
      class="fixed right-4 bottom-4 z-50 space-y-2"
      data-testid="notifications-container"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="[
          'rounded-md px-4 py-3 shadow-lg',
          'flex items-center justify-between',
          'max-w-sm transition-all duration-300',
          {
            'border border-blue-200 bg-blue-100 text-blue-800':
              notification.type === 'info',
            'border border-green-200 bg-green-100 text-green-800':
              notification.type === 'success',
            'border border-yellow-200 bg-yellow-100 text-yellow-800':
              notification.type === 'warning',
            'border border-red-200 bg-red-100 text-red-800':
              notification.type === 'error',
          },
        ]"
        :data-testid="`notification-${notification.id}`"
      >
        <span class="flex-1">{{ notification.message }}</span>
        <button
          v-if="notification.dismissible"
          type="button"
          class="ml-2 text-current opacity-70 hover:opacity-100"
          aria-label="Dismiss notification"
          @click="dismissNotification(notification.id)"
        >
          <svg
            class="h-4 w-4"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TopBar from '~/components/molecules/TopBar.vue';
import Sidebar from '~/components/molecules/Sidebar.vue';
import { useNavigation } from '~/composables/useNavigation';
import { useMobile } from '~/composables/useMobile';
import type { NavigationItem } from '~/types/navigation';
import type { NotificationMessage } from '~/types/content';

/**
 * DefaultLayout Template Component
 *
 * A template component that provides the standard layout structure with:
 * - TopBar with app name and mobile hamburger menu
 * - Sidebar with navigation items
 * - Main content area with slot for page content
 * - Mobile-responsive behavior
 * - Notification system
 *
 * Uses atomic design principles as a template that composes organisms and molecules.
 */
export interface DefaultLayoutProps {
  /** Application name */
  appName?: string;

  /** Optional logo URL */
  logoUrl?: string;

  /** Additional CSS classes */
  class?: string;
}

// Props with defaults
const props = withDefaults(defineProps<DefaultLayoutProps>(), {
  appName: 'DORA Metrics App',
  class: '',
});

// Router
const router = useRouter();

// Composables
const navigation = useNavigation({
  autoCloseSidebar: true,
  notificationTimeout: 5000,
});

const mobile = useMobile({
  autoCloseSidebarOnDesktop: true,
});

// Local state
const notifications = ref<NotificationMessage[]>([]);

// Destructure composable returns
const {
  navigationItems,
  currentRoute,
  isSidebarOpen,
  toggleSidebar,
  closeSidebar,
  openSidebar,
  navigateToItem,
  showNotification,
} = navigation;

const { isMobile } = mobile;

// Sync mobile composable with navigation composable
watch(
  () => mobile.sidebarOpen.value,
  (isOpen) => {
    if (isOpen !== isSidebarOpen.value) {
      if (isOpen) {
        openSidebar();
      } else {
        closeSidebar();
      }
    }
  }
);

watch(
  () => isSidebarOpen.value,
  (isOpen) => {
    if (isOpen !== mobile.sidebarOpen.value) {
      if (isOpen) {
        mobile.openSidebar();
      } else {
        mobile.closeSidebar();
      }
    }
  }
);

// Event handlers
const handleToggleSidebar = () => {
  toggleSidebar();
  mobile.toggleSidebar();
};

const handleCloseSidebar = () => {
  closeSidebar();
  mobile.closeSidebar();
};

const handleNavigationClick = async (
  item: NavigationItem,
  event: MouseEvent
) => {
  await navigateToItem(item);
};

const handleLogoClick = async (event: MouseEvent) => {
  await router.push('/');
};

const dismissNotification = (id: string) => {
  const index = notifications.value.findIndex((n) => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

// Watch for new notifications from the navigation composable
// In a real implementation, this could be connected to a global notification store
watch(
  () => navigation.showNotification,
  () => {
    // This is a placeholder for notification integration
    // The actual notifications are handled by the navigation composable
  }
);

// Initialize component
onMounted(() => {
  // Any initialization logic can go here
});
</script>

<style scoped>
@reference '~/assets/css/main.css';

/* Component-specific styles using Tailwind CSS utility classes */
.default-layout {
  @apply flex min-h-screen flex-col;
}

.main-content {
  @apply flex-1 overflow-auto;
}

/* Smooth transitions for layout changes */
.main-content {
  transition: margin-left 0.3s ease-in-out;
}

/* Mobile overlay animation */
.mobile-overlay {
  @apply transition-opacity duration-300;
}

/* Notification animations */
.notification {
  @apply transform transition-all duration-300 ease-in-out;
  animation: slideInRight 0.3s ease-out;
}

.notification:hover {
  @apply scale-105 shadow-xl;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    @apply p-4;
  }
}

@media (min-width: 768px) {
  .main-content {
    @apply p-6;
  }
}

/* Animation keyframes */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Dark mode enhancements */
.dark .default-layout {
  @apply bg-gray-900;
}

.dark .main-content {
  @apply text-gray-100;
}

/* Focus management for accessibility */
.default-layout:focus-within {
  @apply outline-none;
}

/* Print styles */
@media print {
  .default-layout {
    @apply bg-white;
  }

  .notification {
    @apply hidden;
  }

  .mobile-overlay {
    @apply hidden;
  }
}
</style>
