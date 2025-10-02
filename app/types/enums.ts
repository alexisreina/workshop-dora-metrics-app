export enum DeploymentStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum FailureSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum TimePeriodType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export enum BenchmarkCategory {
  ELITE = 'elite',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum DataQualityStatus {
  COMPLETE = 'complete',
  PARTIAL = 'partial',
  INSUFFICIENT = 'insufficient',
}
