<template>
  <div
    class="navigation-layout flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900"
    data-testid="navigation-layout"
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
        class="main-content flex-1 overflow-y-auto"
        :class="[
          'transition-all duration-300',
          {
            'md:ml-64': !isMobile,
            'ml-0': isMobile,
          },
        ]"
        role="main"
        data-testid="main-content"
      >
        <!-- Page Content Slot -->
        <div class="p-4 md:p-6 lg:p-8">
          <slot />
        </div>
      </main>
    </div>

    <!-- Notifications -->
    <div
      v-if="notifications.length > 0"
      class="fixed top-20 right-4 z-50 space-y-2"
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
        <span class="text-sm font-medium">{{ notification.message }}</span>
        <button
          v-if="notification.dismissible"
          type="button"
          class="ml-3 text-current opacity-70 hover:opacity-100"
          :aria-label="`Dismiss ${notification.type} notification`"
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
import { ref, onMounted } from 'vue';
import TopBar from '~/components/molecules/TopBar.vue';
import Sidebar from '~/components/molecules/Sidebar.vue';
import { useNavigation } from '~/composables/useNavigation';
import { useMobile } from '~/composables/useMobile';
import type { NavigationItem } from '~/types/navigation';
import type { NotificationMessage } from '~/types/content';

/**
 * NavigationLayout component props interface
 */
export interface NavigationLayoutProps {
  /** Application name */
  appName?: string;

  /** Optional logo URL */
  logoUrl?: string;

  /** Additional CSS classes */
  class?: string;
}

// Props with defaults
const props = withDefaults(defineProps<NavigationLayoutProps>(), {
  appName: 'DORA Metrics App',
  class: '',
});

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

const { isMobile, sidebarOpen } = mobile;

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
  await navigateToRouter('/');
};

const dismissNotification = (id: string) => {
  const index = notifications.value.findIndex((n) => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

// Initialize component
onMounted(() => {
  // Any initialization logic can go here
});
</script>

<style scoped>
@reference '~/assets/css/main.css';

/* Component-specific styles using Tailwind CSS utility classes */
.navigation-layout {
  @apply flex min-h-screen flex-col;
}

.main-content {
  @apply flex-1 overflow-y-auto;
  /* Ensure smooth transitions when sidebar opens/closes */
  transition: margin-left 0.3s ease-in-out;
}

/* Notification animations */
.notification {
  @apply transform transition-all duration-300 ease-in-out;
  animation: slideInRight 0.3s ease-out;
}

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

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    @apply ml-0;
  }
}

@media (min-width: 768px) {
  .main-content {
    margin-left: 16rem; /* 64 * 0.25rem = 16rem for sidebar width */
  }
}

/* Dark mode adjustments */
.dark .navigation-layout {
  @apply bg-gray-900;
}
</style>
