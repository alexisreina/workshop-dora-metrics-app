import type { DeploymentRecord } from '~/types/deployment';
import { DeploymentStatus } from '~/types/enums';

export interface MockDeploymentOptions {
  count?: number;
  startDate?: Date;
  endDate?: Date;
  failureRate?: number; // Percentage of deployments that should fail (0-100)
}

export function generateMockDeployments(
  options: MockDeploymentOptions = {}
): DeploymentRecord[] {
  const {
    count = 100,
    startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate = new Date(),
    failureRate = 15, // 15% failure rate by default
  } = options;

  const deployments: DeploymentRecord[] = [];
  const services = [
    'user-service',
    'payment-service',
    'notification-service',
    'auth-service',
    'api-gateway',
  ];

  for (let i = 0; i < count; i++) {
    // Generate random timestamp between start and end dates
    const timestamp = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime())
    );

    // Determine if this deployment should fail based on failure rate
    const shouldFail = Math.random() * 100 < failureRate;
    const status = shouldFail
      ? DeploymentStatus.FAILED
      : DeploymentStatus.SUCCESS;

    // Generate failure detection time if deployment failed
    const failureDetectedAt = shouldFail
      ? new Date(timestamp.getTime() + Math.random() * 24 * 60 * 60 * 1000) // Within 24 hours
      : undefined;

    const deployment: DeploymentRecord = {
      id: `deploy-${i + 1}-${timestamp.getTime()}`,
      timestamp,
      status,
      service: services[Math.floor(Math.random() * services.length)],
      version: `v${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`,
      failureDetectedAt,
      alertTriggered: shouldFail && Math.random() > 0.1, // 90% of failures trigger alerts
    };

    deployments.push(deployment);
  }

  // Sort by timestamp (oldest first)
  return deployments.sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
}

export function getDeploymentsInPeriod(
  deployments: DeploymentRecord[],
  startDate: Date,
  endDate: Date
): DeploymentRecord[] {
  return deployments.filter(
    (deployment) =>
      deployment.timestamp >= startDate && deployment.timestamp <= endDate
  );
}

export function calculateFailureRate(deployments: DeploymentRecord[]): {
  totalDeployments: number;
  failedDeployments: number;
  failureRate: number;
} {
  const totalDeployments = deployments.length;
  const failedDeployments = deployments.filter(
    (d) => d.status === DeploymentStatus.FAILED
  ).length;
  const failureRate =
    totalDeployments > 0
      ? Math.round((failedDeployments / totalDeployments) * 100)
      : 0;

  return {
    totalDeployments,
    failedDeployments,
    failureRate,
  };
}
