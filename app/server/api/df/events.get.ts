import { getDeploymentEvents } from '~/server/api/df/services/events.service';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const preset = (query.preset as any) ?? '6m';

  return getDeploymentEvents({
    startDate: query.startDate as string | undefined,
    endDate: query.endDate as string | undefined,
    preset,
    project: query.project as string | undefined,
    repository: query.repository as string | undefined,
    environment: query.environment as string | undefined,
  });
});
