import { getAllEvents } from '~/server/api/df/data.store';
import type { DeploymentEvent } from '~/utils/df/types';
import { applyFilters } from '~/utils/df/filters';

export interface EventsQuery {
  startDate?: string;
  endDate?: string;
  preset?: '14d' | '30d' | '90d' | '6m' | 'custom';
  project?: string;
  repository?: string;
  environment?: string;
}

export function getDeploymentEvents(q: EventsQuery): DeploymentEvent[] {
  const events = getAllEvents();
  const filtered = applyFilters(events, {
    project: q.project,
    repository: q.repository,
    environment: q.environment,
  });

  // date range filter if provided
  const start = q.startDate ? new Date(q.startDate) : null;
  const end = q.endDate ? new Date(q.endDate) : null;

  return filtered.filter((e) => {
    const ts = new Date(e.timestamp);
    if (start && ts < start) return false;
    if (end && ts > end) return false;
    return true;
  });
}
