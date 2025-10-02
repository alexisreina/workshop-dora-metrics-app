import type {
  DeploymentSeries,
  DeploymentSummary,
  Grouping,
} from '~/utils/df/types';

export interface DfQuery {
  startDate?: string;
  endDate?: string;
  preset?: '14d' | '30d' | '90d' | '6m' | 'custom';
  groupBy: Grouping;
  project?: string;
  repository?: string;
  environment?: string;
  rollingAvg?: boolean;
}

export function useDeploymentFrequency() {
  const base = '/api/df';

  async function fetchSeries(params: DfQuery) {
    const query = new URLSearchParams();
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.preset) query.set('preset', params.preset);
    query.set('groupBy', params.groupBy);
    if (params.project) query.set('project', params.project);
    if (params.repository) query.set('repository', params.repository);
    if (params.environment) query.set('environment', params.environment);
    if (params.rollingAvg) query.set('rollingAvg', 'true');

    const { data, error } = await useFetch<DeploymentSeries>(
      `${base}/series?${query.toString()}`
    );
    if (error.value) throw error.value;
    return data.value as DeploymentSeries;
  }

  async function fetchSummary(params: Omit<DfQuery, 'rollingAvg'>) {
    const query = new URLSearchParams();
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.preset) query.set('preset', params.preset);
    query.set('groupBy', params.groupBy);
    if (params.project) query.set('project', params.project);
    if (params.repository) query.set('repository', params.repository);
    if (params.environment) query.set('environment', params.environment);

    const { data, error } = await useFetch<DeploymentSummary>(
      `${base}/summary?${query.toString()}`
    );
    if (error.value) throw error.value;
    return data.value as DeploymentSummary;
  }

  async function fetchEvents(params: Omit<DfQuery, 'groupBy' | 'rollingAvg'>) {
    const query = new URLSearchParams();
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.preset) query.set('preset', params.preset);
    if (params.project) query.set('project', params.project);
    if (params.repository) query.set('repository', params.repository);
    if (params.environment) query.set('environment', params.environment);

    const { data, error } = await useFetch(
      `${base}/events?${query.toString()}`
    );
    if (error.value) throw error.value;
    return data.value as any[];
  }

  return { fetchSeries, fetchSummary, fetchEvents };
}
