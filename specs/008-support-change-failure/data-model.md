# Data Model: Change Failure Rate DORA Metric

**Date**: 2025-10-02  
**Feature**: Support "Change Failure Rate" DORA Metric  
**Status**: Complete

## Core Entities

### ChangeFailureRateMetric

Represents the calculated Change Failure Rate percentage with metadata.

**Fields**:

- `value: number` - The failure rate as a percentage (0-100, no decimals)
- `period: TimePeriod` - The time period this metric covers
- `totalDeployments: number` - Total number of deployments in the period
- `failedDeployments: number` - Number of deployments that caused failures
- `calculatedAt: Date` - When this metric was calculated
- `dataQuality: DataQualityStatus` - Indicates completeness of underlying data

**Validation Rules**:

- `value` must be between 0 and 100 (inclusive)
- `value` must be a whole number (no decimal places)
- `failedDeployments` cannot exceed `totalDeployments`
- `calculatedAt` must be a valid ISO 8601 date
- `period.endDate` must be after `period.startDate`

**State Transitions**: N/A (immutable value object)

### DeploymentRecord

Represents individual deployment events used to calculate failure rates.

**Fields**:

- `id: string` - Unique deployment identifier
- `timestamp: Date` - When the deployment occurred
- `status: DeploymentStatus` - Success or failure status
- `service: string` - Name of the service/application deployed
- `version: string` - Version identifier of the deployment
- `failureDetectedAt?: Date` - When failure was detected (if applicable)
- `alertTriggered: boolean` - Whether monitoring alerts were triggered

**Validation Rules**:

- `id` must be non-empty string
- `timestamp` must be valid ISO 8601 date
- `status` must be one of: 'success', 'failed'
- `failureDetectedAt` must be within 24 hours of `timestamp` (if present)
- `service` and `version` must be non-empty strings

**State Transitions**:

- `pending` → `success` (deployment completed successfully)
- `pending` → `failed` (deployment caused production issues)

### FailureEvent

Represents production incidents linked to deployments.

**Fields**:

- `id: string` - Unique failure event identifier
- `deploymentId: string` - Reference to the deployment that caused the failure
- `detectedAt: Date` - When the failure was first detected
- `severity: FailureSeverity` - Impact level of the failure
- `alertSource: string` - Monitoring system that detected the failure
- `description: string` - Human-readable description of the failure
- `resolvedAt?: Date` - When the failure was resolved (if applicable)

**Validation Rules**:

- `detectedAt` must be within 24 hours of associated deployment
- `severity` must be one of: 'low', 'medium', 'high', 'critical'
- `description` must be non-empty string
- `resolvedAt` must be after `detectedAt` (if present)

**State Transitions**:

- `detected` → `investigating` → `resolved`

### TimePeriod

Represents configurable date ranges for metric filtering.

**Fields**:

- `startDate: Date` - Beginning of the time period
- `endDate: Date` - End of the time period
- `type: TimePeriodType` - Predefined period type
- `label: string` - Human-readable period description

**Validation Rules**:

- `endDate` must be after `startDate`
- `type` must be one of: 'daily', 'weekly', 'monthly', 'quarterly'
- `label` must be non-empty string

**State Transitions**: N/A (immutable value object)

### BenchmarkData

Represents industry benchmark data for comparison.

**Fields**:

- `category: BenchmarkCategory` - Performance category (elite, high, medium, low)
- `minValue: number` - Minimum percentage for this category
- `maxValue: number` - Maximum percentage for this category
- `description: string` - Description of the performance level
- `source: string` - Data source (e.g., "DORA State of DevOps 2023")

**Validation Rules**:

- `category` must be one of: 'elite', 'high', 'medium', 'low'
- `minValue` and `maxValue` must be between 0 and 100
- `maxValue` must be greater than or equal to `minValue`
- `description` and `source` must be non-empty strings

**State Transitions**: N/A (static reference data)

## Type Definitions

### Enums

```typescript
enum DeploymentStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

enum FailureSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

enum TimePeriodType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

enum BenchmarkCategory {
  ELITE = 'elite',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

enum DataQualityStatus {
  COMPLETE = 'complete',
  PARTIAL = 'partial',
  INSUFFICIENT = 'insufficient',
}
```

## Relationships

- `ChangeFailureRateMetric` aggregates data from multiple `DeploymentRecord` entities
- `DeploymentRecord` may be linked to zero or one `FailureEvent`
- `FailureEvent` references exactly one `DeploymentRecord`
- `TimePeriod` is used to filter `DeploymentRecord` entities for metric calculation
- `BenchmarkData` provides comparison context for `ChangeFailureRateMetric` values

## Data Flow

1. `DeploymentRecord` entities are created for each deployment
2. Monitoring systems create `FailureEvent` entities when failures are detected
3. `ChangeFailureRateMetric` is calculated by aggregating deployments and failures within a `TimePeriod`
4. `BenchmarkData` provides industry comparison context for the calculated metric
5. UI components display the metric alongside benchmarks and historical trends

## Storage Considerations

- All entities are stored as JSON for the current implementation
- `DeploymentRecord` and `FailureEvent` entities require time-based indexing for efficient querying
- `ChangeFailureRateMetric` values can be cached to improve performance
- `BenchmarkData` is static and can be embedded in the application
