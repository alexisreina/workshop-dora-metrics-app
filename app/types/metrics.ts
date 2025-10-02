import type { TimePeriod, DataQualityStatus } from './common';

export interface ChangeFailureRateMetric {
  value: number; // The failure rate as a percentage (0-100, no decimals)
  period: TimePeriod; // The time period this metric covers
  totalDeployments: number; // Total number of deployments in the period
  failedDeployments: number; // Number of deployments that caused failures
  calculatedAt: Date; // When this metric was calculated
  dataQuality: DataQualityStatus; // Indicates completeness of underlying data
}

export interface ChangeFailureRateResponse {
  metric: ChangeFailureRateMetric;
  period: TimePeriod;
  dataQuality: DataQualityStatus;
  lastUpdated: string;
}

export interface HistoricalDataPoint {
  date: string; // Date for this data point
  value: number; // Change Failure Rate percentage for this period (0-100)
  totalDeployments: number; // Total deployments in this period
  failedDeployments: number; // Failed deployments in this period
}

export interface HistoricalDataResponse {
  data: HistoricalDataPoint[]; // Array of historical data points
  period: string; // Time period granularity
  totalPoints: number; // Total number of data points returned
}
