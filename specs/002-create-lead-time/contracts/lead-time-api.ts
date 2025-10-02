// Lead Time API Contracts
// Generated: 2025-10-02
// Purpose: API interface definitions for Lead Time DORA metric data

// Base API Response Structure

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string; // ISO 8601 format
  version: string;   // API version
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Lead Time Metric API

export interface LeadTimeMetricRequest {
  timeWindow?: '7d' | '30d' | '90d'; // Default: 30d
  includeInsights?: boolean;          // Default: true
  includeTrend?: boolean;             // Default: true
}

export interface LeadTimeMetricResponse {
  metric: {
    value: number;              // Lead time in weeks
    unit: 'weeks';
    timeWindow: string;         // Human readable (e.g., "Last 30 days")
    calculatedAt: string;       // ISO 8601 timestamp
    dataPoints: number;         // Number of deployments used
    isInsufficient: boolean;    // True if < 5 data points
  };
  classification: {
    level: 'Elite' | 'High' | 'Medium' | 'Low' | 'Insufficient Data';
    threshold: {
      min: number;              // Minimum weeks for this level
      max: number;              // Maximum weeks for this level
    };
    percentile: number | null;  // Industry percentile (0-100)
    description: string;        // Human readable explanation
  };
  trend?: {
    points: Array<{
      date: string;             // ISO 8601 date
      leadTime: number;         // Lead time in weeks
      deploymentCount: number;  // Deployments that day
    }>;
    startDate: string;          // ISO 8601 date
    endDate: string;            // ISO 8601 date
    totalDeployments: number;
    direction: 'improving' | 'declining' | 'stable' | 'unknown';
    changePercent: number | null; // Percentage change from previous period
  };
  insights?: {
    summary: string;
    trendDescription: string;
    recommendation?: string;
    lastUpdated: string;        // ISO 8601 timestamp
  };
}

// Refresh API

export interface RefreshRequest {
  force?: boolean;              // Force refresh even if recent data exists
  includeHistorical?: boolean;  // Recalculate historical trend data
}

export interface RefreshResponse {
  refreshed: boolean;
  lastRefresh: string;          // ISO 8601 timestamp
  dataAge: number;              // Age in minutes since last calculation
  nextRefreshAvailable: string; // ISO 8601 timestamp
}

// Health Check API

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    database: 'up' | 'down' | 'degraded';
    calculations: 'up' | 'down' | 'degraded';
    cache: 'up' | 'down' | 'degraded';
  };
  lastDataUpdate: string;       // ISO 8601 timestamp
  version: string;
}

// Configuration API

export interface ConfigurationResponse {
  thresholds: {
    elite: { min: number; max: number };
    high: { min: number; max: number };
    medium: { min: number; max: number };
    low: { min: number; max: number };
  };
  dataRetention: {
    maxHistoryDays: number;     // Maximum historical data (90)
    minDataPoints: number;      // Minimum for valid calculation (5)
  };
  refreshLimits: {
    minIntervalMinutes: number; // Minimum time between refreshes
    maxRequestsPerHour: number; // Rate limiting
  };
  features: {
    manualRefresh: boolean;
    historicalTrends: boolean;
    insights: boolean;
    exportData: boolean;
  };
}

// Mock Data Endpoints (Development Only)

export interface MockDataRequest {
  scenario: 'elite' | 'high' | 'medium' | 'low' | 'insufficient' | 'improving' | 'declining';
  dataPoints?: number;          // Number of historical points to generate
  variance?: number;            // Data variance (0-1, default 0.2)
}

export interface MockDataResponse {
  scenario: string;
  generated: string;            // ISO 8601 timestamp
  dataPoints: number;
  note: string;                 // Description of generated scenario
}

// Error Response Codes

export const API_ERROR_CODES = {
  INVALID_TIME_WINDOW: 'INVALID_TIME_WINDOW',
  INSUFFICIENT_DATA: 'INSUFFICIENT_DATA',
  CALCULATION_ERROR: 'CALCULATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INVALID_REQUEST: 'INVALID_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND'
} as const;

// HTTP Status Mappings

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

// API Endpoints

export const API_ENDPOINTS = {
  LEAD_TIME_METRIC: '/api/metrics/lead-time',
  REFRESH: '/api/metrics/lead-time/refresh',
  HEALTH: '/api/health',
  CONFIG: '/api/config',
  MOCK_DATA: '/api/mock/lead-time'  // Development only
} as const;

// Request Headers

export interface ApiHeaders {
  'Content-Type': 'application/json';
  'Accept': 'application/json';
  'X-API-Version': string;
  'X-Request-ID'?: string;        // For request tracing
  'Authorization'?: string;       // If authentication required
}

// Composable Integration Types

export interface UseLeadTimeApiOptions {
  autoRefresh?: boolean;          // Auto-refresh on mount
  refreshInterval?: number;       // Auto-refresh interval (minutes)
  onError?: (error: ApiError) => void;
  onSuccess?: (data: LeadTimeMetricResponse) => void;
}

export interface UseLeadTimeApiReturn {
  data: Ref<LeadTimeMetricResponse | null>;
  loading: Ref<boolean>;
  error: Ref<ApiError | null>;
  refresh: () => Promise<void>;
  lastRefresh: Ref<Date | null>;
}

// Type Guards

export function isApiError(response: any): response is ApiError {
  return response && typeof response.code === 'string' && typeof response.message === 'string';
}

export function isLeadTimeMetricResponse(response: any): response is LeadTimeMetricResponse {
  return response && 
         response.metric && 
         typeof response.metric.value === 'number' &&
         response.classification &&
         typeof response.classification.level === 'string';
}

// Validation Schemas

export const LeadTimeMetricRequestSchema = {
  timeWindow: { 
    type: 'string', 
    required: false, 
    enum: ['7d', '30d', '90d'],
    default: '30d'
  },
  includeInsights: { 
    type: 'boolean', 
    required: false, 
    default: true 
  },
  includeTrend: { 
    type: 'boolean', 
    required: false, 
    default: true 
  }
} as const;