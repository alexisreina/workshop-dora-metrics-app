import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type {
  NavigationItem,
  NavigationState,
  NavigationApiResponse,
} from '~/types/navigation';
import type { NotificationMessage } from '~/types/content';

/**
 * Navigation composable interface
 */
export interface UseNavigationReturn {
  // State
  navigationItems: Ref<NavigationItem[]>;
  currentRoute: Ref<string>;
  isSidebarOpen: Ref<boolean>;
  activeItem: ComputedRef<NavigationItem | undefined>;

  // Actions
  setNavigationItems: (items: NavigationItem[]) => void;
  setActiveRoute: (route: string) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  navigateToItem: (item: NavigationItem) => Promise<void>;

  // Utilities
  isItemActive: (item: NavigationItem) => boolean;
  getItemByRoute: (route: string) => NavigationItem | undefined;
  showNotification: (
    message: string,
    type?: NotificationMessage['type']
  ) => void;
}

/**
 * Navigation composable options
 */
export interface UseNavigationOptions {
  /** Initial navigation items */
  initialItems?: NavigationItem[];

  /** Whether to auto-close sidebar on navigation (mobile) */
  autoCloseSidebar?: boolean;

  /** Default notification timeout */
  notificationTimeout?: number;
}

/**
 * Navigation composable for managing navigation state and actions
 * Provides reactive navigation state management with TypeScript interfaces
 */
export function useNavigation(
  options: UseNavigationOptions = {}
): UseNavigationReturn {
  const router = useRouter();
  const route = useRoute();

  // Default options
  const {
    initialItems = [],
    autoCloseSidebar = true,
    notificationTimeout = 5000,
  } = options;

  // Reactive state
  const navigationItems = ref<NavigationItem[]>(initialItems);
  const currentRoute = ref<string>(route.path);
  const isSidebarOpen = ref<boolean>(false);
  const notifications = ref<NotificationMessage[]>([]);

  // Actions (defined before watchers to avoid initialization issues)
  const setNavigationItems = (items: NavigationItem[]) => {
    navigationItems.value = items.map((item) => ({
      ...item,
      isActive: item.route === currentRoute.value,
    }));
  };

  const setActiveRoute = (routePath: string) => {
    currentRoute.value = routePath;

    // Update active state for all items
    navigationItems.value = navigationItems.value.map((item) => ({
      ...item,
      isActive: item.route === routePath,
    }));
  };

  // Computed properties
  const activeItem = computed(() =>
    navigationItems.value.find((item) => item.isActive)
  );

  // Watch route changes (after setActiveRoute is defined)
  watch(
    () => route.path,
    (newPath) => {
      setActiveRoute(newPath);
    },
    { immediate: true }
  );

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const closeSidebar = () => {
    isSidebarOpen.value = false;
  };

  const openSidebar = () => {
    isSidebarOpen.value = true;
  };

  const navigateToItem = async (item: NavigationItem) => {
    try {
      // Check if route exists (basic check)
      const routeExists = router.hasRoute(item.route.slice(1)); // Remove leading slash

      if (!routeExists) {
        // Navigate to welcome page with notification
        await router.push('/');
        showNotification(
          "This section is coming soon. You've been redirected to the welcome page.",
          'info'
        );
        return;
      }

      // Navigate to the route
      await router.push(item.route);

      // Auto-close sidebar on mobile if enabled
      if (autoCloseSidebar) {
        closeSidebar();
      }
    } catch (error) {
      console.error('Navigation error:', error);
      showNotification('Navigation failed. Please try again.', 'error');
    }
  };

  // Utilities
  const isItemActive = (item: NavigationItem): boolean => {
    return item.route === currentRoute.value;
  };

  const getItemByRoute = (routePath: string): NavigationItem | undefined => {
    return navigationItems.value.find((item) => item.route === routePath);
  };

  const showNotification = (
    message: string,
    type: NotificationMessage['type'] = 'info'
  ) => {
    const notification: NotificationMessage = {
      id: `notification-${Date.now()}`,
      message,
      type,
      dismissible: true,
      timeout: notificationTimeout,
    };

    notifications.value.push(notification);

    // Auto-dismiss if timeout is set
    if (notification.timeout) {
      setTimeout(() => {
        dismissNotification(notification.id);
      }, notification.timeout);
    }
  };

  const dismissNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  // Initialize with placeholder navigation items
  if (navigationItems.value.length === 0) {
    const placeholderItems: NavigationItem[] = [
      {
        id: 'metrics-1',
        label: 'Metrics 1',
        route: '/metrics/1',
        isActive: false,
        isVisible: true,
        order: 1,
      },
      {
        id: 'metrics-2',
        label: 'Metrics 2',
        route: '/metrics/2',
        isActive: false,
        isVisible: true,
        order: 2,
      },
      {
        id: 'metrics-3',
        label: 'Metrics 3',
        route: '/metrics/3',
        isActive: false,
        isVisible: true,
        order: 3,
      },
    ];

    setNavigationItems(placeholderItems);
  }

  return {
    // State
    navigationItems,
    currentRoute,
    isSidebarOpen,
    activeItem,

    // Actions
    setNavigationItems,
    setActiveRoute,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    navigateToItem,

    // Utilities
    isItemActive,
    getItemByRoute,
    showNotification,
  };
}
