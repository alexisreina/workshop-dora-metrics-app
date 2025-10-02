import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { MobileState } from '~/types/navigation';

/**
 * Mobile composable interface
 */
export interface UseMobileReturn {
  // State
  isMobile: Ref<boolean>;
  sidebarOpen: Ref<boolean>;
  breakpoint: Ref<string>;
  screenWidth: Ref<number>;
  screenHeight: Ref<number>;

  // Computed
  isTablet: ComputedRef<boolean>;
  isDesktop: ComputedRef<boolean>;
  orientation: ComputedRef<'portrait' | 'landscape'>;

  // Actions
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  updateBreakpoint: () => void;

  // Utilities
  isBreakpoint: (breakpoint: string) => boolean;
  getBreakpointValue: (breakpoint: string) => number;
}

/**
 * Mobile composable options
 */
export interface UseMobileOptions {
  /** Custom breakpoints */
  breakpoints?: Record<string, number>;

  /** Initial sidebar state */
  initialSidebarOpen?: boolean;

  /** Whether to auto-close sidebar on resize to desktop */
  autoCloseSidebarOnDesktop?: boolean;
}

/**
 * Default responsive breakpoints (mobile-first)
 */
const defaultBreakpoints = {
  sm: 640, // Small devices (phones)
  md: 768, // Medium devices (tablets)
  lg: 1024, // Large devices (desktops)
  xl: 1280, // Extra large devices
  '2xl': 1536, // 2X large devices
};

/**
 * Mobile composable for managing mobile-specific navigation behavior
 * Provides reactive mobile state management with TypeScript interfaces
 */
export function useMobile(options: UseMobileOptions = {}): UseMobileReturn {
  const {
    breakpoints = defaultBreakpoints,
    initialSidebarOpen = false,
    autoCloseSidebarOnDesktop = true,
  } = options;

  // Reactive state
  const isMobile = ref<boolean>(false);
  const sidebarOpen = ref<boolean>(initialSidebarOpen);
  const breakpoint = ref<string>('sm');
  const screenWidth = ref<number>(0);
  const screenHeight = ref<number>(0);

  // Computed properties
  const isTablet = computed(
    () =>
      screenWidth.value >= breakpoints.md && screenWidth.value < breakpoints.lg
  );

  const isDesktop = computed(() => screenWidth.value >= breakpoints.lg);

  const orientation = computed<'portrait' | 'landscape'>(() =>
    screenHeight.value > screenWidth.value ? 'portrait' : 'landscape'
  );

  // Actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  const closeSidebar = () => {
    sidebarOpen.value = false;
  };

  const openSidebar = () => {
    sidebarOpen.value = true;
  };

  const updateBreakpoint = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    screenWidth.value = width;
    screenHeight.value = height;

    // Determine current breakpoint
    if (width < breakpoints.sm) {
      breakpoint.value = 'xs';
      isMobile.value = true;
    } else if (width < breakpoints.md) {
      breakpoint.value = 'sm';
      isMobile.value = true;
    } else if (width < breakpoints.lg) {
      breakpoint.value = 'md';
      isMobile.value = false; // Tablet treated as desktop for navigation
    } else if (width < breakpoints.xl) {
      breakpoint.value = 'lg';
      isMobile.value = false;
    } else if (width < breakpoints['2xl']) {
      breakpoint.value = 'xl';
      isMobile.value = false;
    } else {
      breakpoint.value = '2xl';
      isMobile.value = false;
    }

    // Auto-close sidebar when switching to desktop
    if (autoCloseSidebarOnDesktop && !isMobile.value && sidebarOpen.value) {
      closeSidebar();
    }
  };

  // Utilities
  const isBreakpoint = (bp: string): boolean => {
    return breakpoint.value === bp;
  };

  const getBreakpointValue = (bp: string): number => {
    return breakpoints[bp] || 0;
  };

  // Event handlers
  const handleResize = () => {
    updateBreakpoint();
  };

  const handleOrientationChange = () => {
    // Delay to ensure screen dimensions are updated
    setTimeout(() => {
      updateBreakpoint();
    }, 100);
  };

  // Lifecycle hooks
  onMounted(() => {
    // Initial setup
    updateBreakpoint();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Listen for media query changes for better performance
    const mediaQueries = Object.entries(breakpoints).map(([name, value]) => {
      const mq = window.matchMedia(`(min-width: ${value}px)`);
      mq.addEventListener('change', updateBreakpoint);
      return { name, mq };
    });

    // Store media queries for cleanup
    (window as any).__mobileComposableMediaQueries = mediaQueries;
  });

  onUnmounted(() => {
    // Clean up event listeners
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);

    // Clean up media query listeners
    const mediaQueries = (window as any).__mobileComposableMediaQueries;
    if (mediaQueries) {
      mediaQueries.forEach(({ mq }: any) => {
        mq.removeEventListener('change', updateBreakpoint);
      });
      delete (window as any).__mobileComposableMediaQueries;
    }
  });

  return {
    // State
    isMobile,
    sidebarOpen,
    breakpoint,
    screenWidth,
    screenHeight,

    // Computed
    isTablet,
    isDesktop,
    orientation,

    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar,
    updateBreakpoint,

    // Utilities
    isBreakpoint,
    getBreakpointValue,
  };
}
