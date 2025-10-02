import { generateFakeEvents } from '~/utils/df/fakeData';
import type { DeploymentEvent } from '~/utils/df/types';

let eventsCache: DeploymentEvent[] | null = null;

function bootstrap(): DeploymentEvent[] {
  if (eventsCache) return eventsCache;
  eventsCache = generateFakeEvents({ seed: 12345, monthsBack: 6 });
  return eventsCache;
}

export function getAllEvents(): DeploymentEvent[] {
  return bootstrap();
}

export function replaceAllEvents(newEvents: DeploymentEvent[]) {
  eventsCache = [...newEvents];
}
