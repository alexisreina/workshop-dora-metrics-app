/**
 * NavigationItem type definition for sidebar navigation
 * Represents a clickable navigation link in the sidebar
 */
export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;

  /** Display text (e.g., "Metrics 1", "Metrics 2") */
  label: string;

  /** Target route path (e.g., "/metrics/1", "/metrics/2") */
  route: string;

  /** Whether this item is currently selected */
  isActive: boolean;

  /** Whether this item should be displayed */
  isVisible: boolean;

  /** Display order in the navigation list */
  order: number;
}

/**
 * Navigation state management interface
 * Manages the overall navigation state
 */
export interface NavigationState {
  /** Currently active route */
  currentRoute: string;

  /** Mobile sidebar visibility state */
  isSidebarOpen: boolean;

  /** Device type detection */
  isMobile: boolean;

  /** List of all navigation items */
  navigationItems: NavigationItem[];
}

/**
 * Mobile-specific navigation state
 * Manages mobile-specific navigation behavior
 */
export interface MobileState {
  /** Current device type */
  isMobile: boolean;

  /** Sidebar visibility */
  sidebarOpen: boolean;

  /** Current responsive breakpoint */
  breakpoint: string;
}

/**
 * Navigation API response interface
 */
export interface NavigationApiResponse {
  items: NavigationItem[];
  currentRoute: string;
  isMobile: boolean;
}

/**
 * Navigation state update request interface
 */
export interface NavigationStateUpdate {
  currentRoute?: string;
  isSidebarOpen?: boolean;
  isMobile?: boolean;
}
