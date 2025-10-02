import type { DeploymentStatus } from './enums';

export interface DeploymentRecord {
  id: string; // Unique deployment identifier
  timestamp: Date; // When the deployment occurred
  status: DeploymentStatus; // Success or failure status
  service: string; // Name of the service/application deployed
  version: string; // Version identifier of the deployment
  failureDetectedAt?: Date; // When failure was detected (if applicable)
  alertTriggered: boolean; // Whether monitoring alerts were triggered
}
