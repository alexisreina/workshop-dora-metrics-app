/**
 * WelcomeContent type definition for homepage content
 * Represents the descriptive text and information shown on the homepage about the app's purpose
 */
export interface WelcomeContent {
  /** Main heading text */
  title: string;

  /** Brief explanation of DORA metrics */
  description: string;

  /** List of key features or benefits */
  features: string[];
}

/**
 * DORA metrics information interface
 */
export interface DoraMetricsInfo {
  /** Metric identifier */
  id: string;

  /** Metric name */
  name: string;

  /** Brief description */
  description: string;

  /** Detailed explanation */
  details?: string;

  /** Example or use case */
  example?: string;
}

/**
 * Welcome page section interface
 */
export interface WelcomeSection {
  /** Section identifier */
  id: string;

  /** Section title */
  title: string;

  /** Section content */
  content: string;

  /** Section order */
  order: number;

  /** Whether section is visible */
  isVisible: boolean;
}

/**
 * Complete welcome page configuration
 */
export interface WelcomePageConfig {
  /** Main welcome content */
  content: WelcomeContent;

  /** DORA metrics information */
  doraMetrics: DoraMetricsInfo[];

  /** Additional sections */
  sections: WelcomeSection[];

  /** Call-to-action configuration */
  cta?: {
    text: string;
    link: string;
    isVisible: boolean;
  };
}

/**
 * Notification message interface
 */
export interface NotificationMessage {
  /** Message identifier */
  id: string;

  /** Message text */
  message: string;

  /** Message type */
  type: 'info' | 'success' | 'warning' | 'error';

  /** Whether message is dismissible */
  dismissible: boolean;

  /** Auto-dismiss timeout in milliseconds */
  timeout?: number;
}
