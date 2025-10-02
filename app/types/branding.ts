/**
 * AppBranding type definition for application branding and identity
 * Represents the application name and visual identity displayed in the top bar
 */
export interface AppBranding {
  /** Display name ("DORA Metrics App") */
  appName: string;

  /** Optional logo image URL */
  logoUrl?: string;

  /** Theme identifier for styling */
  theme: string;
}

/**
 * Logo configuration interface
 */
export interface LogoConfig {
  /** Logo image URL */
  url: string;

  /** Alt text for accessibility */
  alt: string;

  /** Logo width in pixels */
  width?: number;

  /** Logo height in pixels */
  height?: number;
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  /** Theme identifier */
  id: string;

  /** Theme display name */
  name: string;

  /** Primary color */
  primaryColor: string;

  /** Secondary color */
  secondaryColor: string;

  /** Background color */
  backgroundColor: string;

  /** Text color */
  textColor: string;
}

/**
 * Top bar configuration interface
 */
export interface TopBarConfig {
  /** App branding configuration */
  branding: AppBranding;

  /** Logo configuration */
  logo?: LogoConfig;

  /** Theme configuration */
  theme: ThemeConfig;

  /** Whether to show hamburger menu on mobile */
  showMobileMenu: boolean;
}
