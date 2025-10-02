import { getAllEvents } from '~/server/api/df/data.store';
import type { DeploymentSeries, Grouping } from '~/utils/df/types';
import { applyFilters, isProductionEnvironment } from '~/utils/df/filters';
import { buildBuckets } from '~/utils/df/dateHelpers';
import { computeSevenDayRollingAverage } from '~/utils/df/rollingAverage';

export interface SeriesQuery {
  startDate?: string;
  endDate?: string;
  preset?: '14d' | '30d' | '90d' | '6m' | 'custom';
  groupBy: Grouping;
  project?: string;
  repository?: string;
  environment?: string;
  rollingAvg?: boolean;
}

function resolveRange(q: SeriesQuery): { start: Date; end: Date } {
  // Normalize to local day boundaries for determinism
  const now = q.endDate ? new Date(q.endDate) : new Date();
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  const preset = q.preset ?? '6m';
  const startBase = q.startDate ? new Date(q.startDate) : new Date(end);

  if (!q.startDate) {
    if (preset === '14d') startBase.setDate(startBase.getDate() - 14);
    else if (preset === '30d') startBase.setDate(startBase.getDate() - 30);
    else if (preset === '90d') startBase.setDate(startBase.getDate() - 90);
    else if (preset === '6m') startBase.setMonth(startBase.getMonth() - 6);
  }

  const start = new Date(
    startBase.getFullYear(),
    startBase.getMonth(),
    startBase.getDate(),
    0,
    0,
    0,
    0
  );

  return { start, end };
}

export function getDeploymentSeries(q: SeriesQuery): DeploymentSeries {
  const { start, end } = resolveRange(q);
  const all = getAllEvents();
  const filtered = applyFilters(all, {
    project: q.project,
    repository: q.repository,
    environment: q.environment,
  });

  const prodSuccess = filtered.filter(
    (e) => isProductionEnvironment(e.environment) && e.status === 'success'
  );

  const buckets = buildBuckets(start, end, q.groupBy);

  for (const e of prodSuccess) {
    const ts = new Date(e.timestamp);
    for (const b of buckets) {
      if (ts >= new Date(b.start) && ts <= new Date(b.end)) {
        b.count += 1;
        break;
      }
    }
  }

  const series: DeploymentSeries = {
    grouping: q.groupBy,
    buckets,
  };

  if (q.rollingAvg && q.groupBy === 'day') {
    series.rollingAverage = computeSevenDayRollingAverage(buckets);
  }

  return series;
}
