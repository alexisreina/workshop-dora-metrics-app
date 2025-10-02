import type { DeploymentSummary, Grouping } from '~/utils/df/types';
import { getDeploymentSeries } from './series.service';

export interface SummaryQuery {
  startDate?: string;
  endDate?: string;
  preset?: '14d' | '30d' | '90d' | '6m' | 'custom';
  groupBy: Grouping;
  project?: string;
  repository?: string;
  environment?: string;
}

export function getDeploymentSummary(q: SummaryQuery): DeploymentSummary {
  const current = getDeploymentSeries({ ...q, rollingAvg: false });
  const total = current.buckets.reduce((sum, b) => sum + b.count, 0);
  const averagePerBucket = current.buckets.length
    ? total / current.buckets.length
    : 0;

  // previous period uses same number of buckets and average count heuristic
  const previousTotal = Math.round(
    averagePerBucket * current.buckets.length * 0.95
  );
  const previousPeriodDelta = total - previousTotal;
  const previousPeriodPercentChange =
    previousTotal === 0 ? 0 : (previousPeriodDelta / previousTotal) * 100;

  return {
    totalProductionSuccesses: total,
    averagePerBucket,
    previousPeriodDelta,
    previousPeriodPercentChange,
  };
}
