export type DeploymentStatus = 'success' | 'failure';

export interface DeploymentEvent {
  id: string;
  timestamp: string; // ISO local timezone string
  project: string;
  repository: string;
  environment: string;
  status: DeploymentStatus;
  notes?: string;
}

export type Grouping = 'day' | 'week' | 'month';

export interface SeriesBucket {
  label: string;
  start: string; // ISO date-time
  end: string; // ISO date-time
  count: number;
}

export interface RollingPoint {
  label: string;
  value: number;
}

export interface DeploymentSeries {
  grouping: Grouping;
  buckets: SeriesBucket[];
  rollingAverage?: RollingPoint[];
}

export interface DeploymentSummary {
  totalProductionSuccesses: number;
  averagePerBucket: number;
  previousPeriodDelta: number;
  previousPeriodPercentChange: number;
}

export interface DfFilters {
  project: string | 'All';
  repository: string | 'All';
  environment: string | 'All';
}
