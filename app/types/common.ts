import type {
  TimePeriodType,
  BenchmarkCategory,
  DataQualityStatus as DataQualityStatusEnum,
} from './enums';

export interface TimePeriod {
  startDate: Date; // Beginning of the time period
  endDate: Date; // End of the time period
  type: TimePeriodType; // Predefined period type
  label: string; // Human-readable period description
}

export interface BenchmarkData {
  category: BenchmarkCategory; // Performance category (elite, high, medium, low)
  minValue: number; // Minimum percentage for this category
  maxValue: number; // Maximum percentage for this category
  description: string; // Description of the performance level
  source: string; // Data source (e.g., "DORA State of DevOps 2023")
}

export interface BenchmarkResponse {
  benchmarks: BenchmarkData[]; // Industry benchmark categories
  source: string; // Source of benchmark data
  lastUpdated: string; // When benchmark data was last updated
}

export type DataQualityStatus = DataQualityStatusEnum;

export interface ErrorResponse {
  error: string; // Error code
  message: string; // Human-readable error message
  details?: object; // Additional error details (optional)
}
