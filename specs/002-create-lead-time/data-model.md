# Data Model: Lead Time for Changes DORA Metric Screen

**Feature**: Lead Time for Changes DORA Metric Display  
**Date**: 2025-10-02  
**Status**: Complete

## Core Entities

### LeadTimeMetric

**Purpose**: Represents the current lead time measurement with context

**Fields**:
```typescript
interface LeadTimeMetric {
  value: number;              // Lead time in weeks (decimal precision)
  unit: 'weeks';             // Always weeks per requirements
  timeWindow: string;        // Context description (e.g., "Last 30 days")
  calculatedAt: Date;        // When the metric was calculated
  dataPoints: number;        // Number of deployments in calculation
  isInsufficient: boolean;   // True if < 5 data points
}
```

**Validation Rules**:
- `value` must be >= 0
- `value` precision limited to 2 decimal places
- `dataPoints` must be >= 0
- `isInsufficient` true when `dataPoints` < 5

**State Transitions**:
- Loading → Loaded (successful data fetch)
- Loading → Error (failed data fetch)
- Loaded → Refreshing (manual refresh triggered)
- Refreshing → Loaded (refresh completed)

### TrendData

**Purpose**: Historical lead time measurements for visualization

**Fields**:
```typescript
interface TrendDataPoint {
  date: Date;               // Measurement date
  leadTime: number;         // Lead time in weeks
  deploymentCount: number;  // Number of deployments that day
}

interface TrendData {
  points: TrendDataPoint[];  // Array of historical measurements
  startDate: Date;          // First date in range (90 days ago)
  endDate: Date;            // Last date in range (today)
  totalDeployments: number; // Sum of all deployments in period
}
```

**Validation Rules**:
- `points` array sorted by date ascending
- Maximum 90 data points (daily measurements)
- `leadTime` values must be >= 0
- `deploymentCount` must be >= 0

**Relationships**:
- One TrendData per LeadTimeMetric
- TrendData.endDate aligns with LeadTimeMetric.calculatedAt

### DoraClassification

**Purpose**: Performance classification based on DORA benchmarks

**Fields**:
```typescript
type ClassificationLevel = 'Elite' | 'High' | 'Medium' | 'Low' | 'Insufficient Data';

interface DoraClassification {
  level: ClassificationLevel;
  threshold: {
    min: number;            // Minimum weeks for this level
    max: number;            // Maximum weeks for this level  
  };
  color: string;            // Tailwind CSS color class
  description: string;      // Human-readable explanation
  percentile: number | null; // Industry percentile (null for insufficient data)
}
```

**Classification Thresholds**:
- Elite: 0 - 0.14 weeks (< 1 day)
- High: 0.14 - 1 weeks (1 day to 1 week)
- Medium: 1 - 4.3 weeks (1 week to 1 month)
- Low: > 4.3 weeks (> 1 month)
- Insufficient Data: When dataPoints < 5

**Color Mapping**:
- Elite: `text-green-600 bg-green-100`
- High: `text-blue-600 bg-blue-100`
- Medium: `text-yellow-600 bg-yellow-100`
- Low: `text-red-600 bg-red-100`
- Insufficient Data: `text-gray-600 bg-gray-100`

### InsightData

**Purpose**: Contextual information and explanatory text

**Fields**:
```typescript
interface InsightData {
  summary: string;          // Brief performance summary
  trend: 'improving' | 'declining' | 'stable' | 'unknown';
  trendDescription: string; // Explanation of trend direction
  recommendation: string;   // Actionable advice (optional)
  lastUpdated: Date;       // When insights were generated
}
```

**Business Rules**:
- Trend calculation based on 30-day vs 60-day averages
- Improving: Recent average < historical average by >10%
- Declining: Recent average > historical average by >10%
- Stable: Difference within ±10%
- Unknown: Insufficient data for comparison

## Data Flow

### Initial Load
1. Component mounts → triggers `useLeadTimeData` composable
2. Composable fetches mock data → returns LeadTimeMetric + TrendData
3. `useDoraClassification` calculates classification from metric value
4. `useChartData` transforms TrendData for Chart.js consumption
5. UI renders with all data populated

### Manual Refresh
1. User clicks refresh button → triggers refresh action
2. Loading state activated → skeleton UI shown
3. New data fetched → all entities updated
4. UI re-renders with updated values
5. Success/error feedback provided

### Error Handling
1. Network errors → show error state with retry option
2. Invalid data → fallback to "Insufficient Data" classification
3. Chart rendering errors → show data table alternative

## Mock Data Structure

### Sample LeadTimeMetric
```typescript
const mockMetric: LeadTimeMetric = {
  value: 2.3,
  unit: 'weeks',
  timeWindow: 'Last 30 days',
  calculatedAt: new Date('2025-10-02'),
  dataPoints: 15,
  isInsufficient: false
};
```

### Sample TrendData
```typescript
const mockTrend: TrendData = {
  points: [
    { date: new Date('2025-07-03'), leadTime: 3.1, deploymentCount: 2 },
    { date: new Date('2025-07-04'), leadTime: 2.8, deploymentCount: 1 },
    // ... 88 more daily points
  ],
  startDate: new Date('2025-07-03'),
  endDate: new Date('2025-10-02'),
  totalDeployments: 127
};
```

## Validation Schema

### Runtime Validation
- Use Zod schemas for type-safe data validation
- Validate API responses before state updates
- Sanitize user inputs (refresh triggers)

### Type Safety
- Strict TypeScript interfaces for all entities
- Branded types for units (weeks vs days)
- Exhaustive switch statements for classifications

## Performance Considerations

### Data Size Limits
- TrendData limited to 90 points maximum
- Chart rendering optimized for datasets up to 1000 points
- Lazy loading for large historical datasets

### Caching Strategy
- In-memory caching for current session
- No persistent storage (manual refresh only)
- Cache invalidation on refresh action

### Memory Management
- Proper cleanup of chart instances
- Reactive data cleanup in component unmount
- Avoid memory leaks in composables