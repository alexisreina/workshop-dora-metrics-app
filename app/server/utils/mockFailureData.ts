import type { FailureEvent } from '~/types/failure';
import type { DeploymentRecord } from '~/types/deployment';
import { FailureSeverity, DeploymentStatus } from '~/types/enums';

export function generateMockFailureEvents(
  deployments: DeploymentRecord[]
): FailureEvent[] {
  const failureEvents: FailureEvent[] = [];
  const alertSources = [
    'DataDog',
    'New Relic',
    'Prometheus',
    'CloudWatch',
    'PagerDuty',
  ];

  const failureDescriptions = [
    'High error rate detected in API responses',
    'Database connection timeout increased significantly',
    'Memory usage exceeded threshold limits',
    'Service response time degraded beyond SLA',
    'Critical endpoint returning 5xx errors',
    'Authentication service experiencing failures',
    'Payment processing errors increased',
    'User session management failures detected',
    'Cache invalidation causing performance issues',
    'Third-party integration service disruption',
  ];

  deployments
    .filter((deployment) => deployment.status === DeploymentStatus.FAILED)
    .forEach((deployment, index) => {
      if (!deployment.failureDetectedAt) return;

      // Generate severity based on random distribution
      const severityRandom = Math.random();
      let severity: FailureSeverity;
      if (severityRandom < 0.1) severity = FailureSeverity.CRITICAL;
      else if (severityRandom < 0.3) severity = FailureSeverity.HIGH;
      else if (severityRandom < 0.7) severity = FailureSeverity.MEDIUM;
      else severity = FailureSeverity.LOW;

      // Generate resolution time (some failures may not be resolved yet)
      const shouldBeResolved = Math.random() > 0.2; // 80% of failures are resolved
      const resolvedAt = shouldBeResolved
        ? new Date(
            deployment.failureDetectedAt.getTime() +
              Math.random() * 48 * 60 * 60 * 1000
          ) // Within 48 hours
        : undefined;

      const failureEvent: FailureEvent = {
        id: `failure-${deployment.id}-${index}`,
        deploymentId: deployment.id,
        detectedAt: deployment.failureDetectedAt,
        severity,
        alertSource:
          alertSources[Math.floor(Math.random() * alertSources.length)],
        description:
          failureDescriptions[
            Math.floor(Math.random() * failureDescriptions.length)
          ],
        resolvedAt,
      };

      failureEvents.push(failureEvent);
    });

  return failureEvents;
}

export function getFailureEventsForDeployments(
  failureEvents: FailureEvent[],
  deploymentIds: string[]
): FailureEvent[] {
  return failureEvents.filter((event) =>
    deploymentIds.includes(event.deploymentId)
  );
}
