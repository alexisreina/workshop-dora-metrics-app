# Data Model: Deployment Frequency View

## Entities

### DeploymentEvent
- id: string
- timestamp: string (ISO local timezone)
- project: string
- repository: string
- environment: string
- status: 'success' | 'failure'
- notes?: string

Constraints:
- Production success counts only when environment equals `prod` or `production` (case-insensitive).
- Timestamps occur between 08:00 and 20:00 local time.

### DeploymentSeries
- grouping: 'day' | 'week' | 'month'
- buckets: Array<{ label: string, start: string, end: string, count: number }>
- rollingAverage?: Array<{ label: string, value: number }>

Labeling:
- day: `yyyy-mm-dd`
- week: `yyyy-Www` (ISO-8601, Monday start)
- month: `yyyy-mm`

### DeploymentSummary
- totalProductionSuccesses: number
- averagePerBucket: number
- previousPeriodDelta: number
- previousPeriodPercentChange: number

### Filters
- project: string | 'All'
- repository: string | 'All'
- environment: string | 'All'

Source of values: Static predefined lists.


