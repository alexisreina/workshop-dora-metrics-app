import { getDeploymentSummary } from '~/server/api/df/services/summary.service';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const groupBy = String(query.groupBy || 'day') as 'day' | 'week' | 'month';
  const preset = (query.preset as any) ?? '6m';

  return getDeploymentSummary({
    startDate: query.startDate as string | undefined,
    endDate: query.endDate as string | undefined,
    preset,
    groupBy,
    project: query.project as string | undefined,
    repository: query.repository as string | undefined,
    environment: query.environment as string | undefined,
  });
});
