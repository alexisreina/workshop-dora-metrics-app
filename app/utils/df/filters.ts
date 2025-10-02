import type { DeploymentEvent } from '~/utils/df/types';

export const STATIC_PROJECTS = ['All', 'Alpha', 'Beta', 'Gamma'] as const;
export const STATIC_REPOSITORIES = [
  'All',
  'frontend',
  'backend',
  'infra',
] as const;
export const STATIC_ENVIRONMENTS = [
  'All',
  'dev',
  'staging',
  'prod',
  'production',
] as const;

export function isProductionEnvironment(env: string): boolean {
  const v = env.toLowerCase();
  return v === 'prod' || v === 'production';
}

export interface FilterInput {
  project?: string;
  repository?: string;
  environment?: string;
}

export function applyFilters(
  events: DeploymentEvent[],
  filters: FilterInput
): DeploymentEvent[] {
  return events.filter((e) => {
    if (
      filters.project &&
      filters.project !== 'All' &&
      e.project !== filters.project
    )
      return false;
    if (
      filters.repository &&
      filters.repository !== 'All' &&
      e.repository !== filters.repository
    )
      return false;
    if (
      filters.environment &&
      filters.environment !== 'All' &&
      e.environment !== filters.environment
    )
      return false;
    return true;
  });
}
