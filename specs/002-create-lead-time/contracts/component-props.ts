// Component Props Contracts for Lead Time DORA Metric Screen
// Generated: 2025-10-02
// Purpose: TypeScript interfaces for component prop validation

// Atomic Components Props

export interface DoraMetricValueProps {
  value: number;
  unit: 'weeks';
  timeWindow: string;
  isLoading?: boolean;
}

export interface DoraClassificationBadgeProps {
  level: 'Elite' | 'High' | 'Medium' | 'Low' | 'Insufficient Data';
  color: string;
  description: string;
  percentile?: number | null;
}

export interface RefreshButtonProps {
  isLoading: boolean;
  onRefresh: () => void;
  disabled?: boolean;
  lastUpdated?: Date;
}

// Molecular Components Props

export interface MetricCardProps {
  metric: {
    value: number;
    unit: 'weeks';
    timeWindow: string;
    calculatedAt: Date;
    dataPoints: number;
    isInsufficient: boolean;
  };
  isLoading?: boolean;
  onRefresh?: () => void;
}

export interface TrendChartProps {
  data: Array<{
    date: Date;
    leadTime: number;
    deploymentCount: number;
  }>;
  isLoading?: boolean;
  height?: number;
  showDataTable?: boolean;
}

export interface InsightSectionProps {
  insight: {
    summary: string;
    trend: 'improving' | 'declining' | 'stable' | 'unknown';
    trendDescription: string;
    recommendation?: string;
    lastUpdated: Date;
  };
  isLoading?: boolean;
}

// Organism Components Props

export interface LeadTimeMetricDisplayProps {
  metric: {
    value: number;
    unit: 'weeks';
    timeWindow: string;
    calculatedAt: Date;
    dataPoints: number;
    isInsufficient: boolean;
  };
  trendData: Array<{
    date: Date;
    leadTime: number;
    deploymentCount: number;
  }>;
  classification: {
    level: 'Elite' | 'High' | 'Medium' | 'Low' | 'Insufficient Data';
    color: string;
    description: string;
    percentile?: number | null;
  };
  insight: {
    summary: string;
    trend: 'improving' | 'declining' | 'stable' | 'unknown';
    trendDescription: string;
    recommendation?: string;
    lastUpdated: Date;
  };
  isLoading?: boolean;
  onRefresh: () => void;
}

// Template Components Props

export interface LeadTimePageTemplateProps {
  title: string;
  subtitle: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

// Event Interfaces

export interface RefreshEvent {
  timestamp: Date;
  source: 'manual' | 'automatic';
  success: boolean;
  error?: string;
}

export interface ChartInteractionEvent {
  type: 'hover' | 'click' | 'zoom';
  dataPoint?: {
    date: Date;
    value: number;
  };
  timestamp: Date;
}

// Validation Schemas (for runtime prop validation)

export const MetricValueSchema = {
  value: { type: 'number', required: true, min: 0 },
  unit: { type: 'string', required: true, enum: ['weeks'] },
  timeWindow: { type: 'string', required: true, minLength: 1 },
  isLoading: { type: 'boolean', required: false, default: false }
} as const;

export const ClassificationSchema = {
  level: { 
    type: 'string', 
    required: true, 
    enum: ['Elite', 'High', 'Medium', 'Low', 'Insufficient Data'] 
  },
  color: { type: 'string', required: true, minLength: 1 },
  description: { type: 'string', required: true, minLength: 1 },
  percentile: { type: 'number', required: false, min: 0, max: 100 }
} as const;

// Accessibility Props

export interface AccessibilityProps {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
}

// Responsive Props

export interface ResponsiveProps {
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
  mobileLayout?: 'stack' | 'grid' | 'carousel';
  desktopLayout?: 'sidebar' | 'grid' | 'dashboard';
}

// Theme Props

export interface ThemeProps {
  variant?: 'default' | 'compact' | 'detailed';
  colorScheme?: 'light' | 'dark' | 'auto';
  emphasis?: 'low' | 'medium' | 'high';
}