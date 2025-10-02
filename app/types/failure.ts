import type { FailureSeverity } from './enums';

export interface FailureEvent {
  id: string; // Unique failure event identifier
  deploymentId: string; // Reference to the deployment that caused the failure
  detectedAt: Date; // When the failure was first detected
  severity: FailureSeverity; // Impact level of the failure
  alertSource: string; // Monitoring system that detected the failure
  description: string; // Human-readable description of the failure
  resolvedAt?: Date; // When the failure was resolved (if applicable)
}
