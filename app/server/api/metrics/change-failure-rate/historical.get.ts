import type {
  HistoricalDataResponse,
  HistoricalDataPoint,
} from '~/types/metrics';
import { TimePeriodType } from '~/types/enums';
import {
  generateMockDeployments,
  getDeploymentsInPeriod,
  calculateFailureRate,
} from '~/server/utils/mockDeploymentData';

export default defineEventHandler(
  async (event): Promise<HistoricalDataResponse> => {
    const query = getQuery(event);

    // Parse query parameters
    const period = (query.period as string) || 'monthly';
    const limit = Math.min(parseInt(query.limit as string) || 12, 100); // Max 100 data points

    // Validate period parameter
    if (!Object.values(TimePeriodType).includes(period as TimePeriodType)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid period parameter. Must be one of: ${Object.values(TimePeriodType).join(', ')}`,
      });
    }

    // Validate limit parameter
    if (limit < 1 || limit > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Limit parameter must be between 1 and 100',
      });
    }

    // Calculate time intervals based on period type
    const now = new Date();
    const dataPoints: HistoricalDataPoint[] = [];

    let intervalMs: number;
    let formatOptions: Intl.DateTimeFormatOptions;

    switch (period as TimePeriodType) {
      case TimePeriodType.DAILY:
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        break;
      case TimePeriodType.WEEKLY:
        intervalMs = 7 * 24 * 60 * 60 * 1000; // 1 week
        formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        break;
      case TimePeriodType.MONTHLY:
        intervalMs = 30 * 24 * 60 * 60 * 1000; // ~1 month
        formatOptions = { year: 'numeric', month: '2-digit' };
        break;
      case TimePeriodType.QUARTERLY:
        intervalMs = 90 * 24 * 60 * 60 * 1000; // ~3 months
        formatOptions = { year: 'numeric', month: '2-digit' };
        break;
      default:
        intervalMs = 30 * 24 * 60 * 60 * 1000;
        formatOptions = { year: 'numeric', month: '2-digit' };
    }

    // Generate mock deployment data for extended period
    const extendedStartDate = new Date(
      now.getTime() - (limit + 2) * intervalMs
    );
    const allDeployments = generateMockDeployments({
      count: limit * 50, // Ensure enough data for each period
      startDate: extendedStartDate,
      endDate: now,
      failureRate: 15, // Base failure rate, will vary by period
    });

    // Generate historical data points
    for (let i = limit - 1; i >= 0; i--) {
      const periodEnd = new Date(now.getTime() - i * intervalMs);
      const periodStart = new Date(periodEnd.getTime() - intervalMs);

      // Add some variation to failure rates over time
      const baseFailureRate = 15;
      const variation = Math.sin(i * 0.5) * 5 + (Math.random() * 6 - 3); // Sine wave + random variation
      const adjustedFailureRate = Math.max(
        5,
        Math.min(25, baseFailureRate + variation)
      );

      // Filter deployments for this period
      const periodDeployments = getDeploymentsInPeriod(
        allDeployments,
        periodStart,
        periodEnd
      );

      // If no deployments in period, generate some with the adjusted failure rate
      let deployments = periodDeployments;
      if (deployments.length === 0) {
        deployments = generateMockDeployments({
          count: Math.floor(Math.random() * 30) + 20, // 20-50 deployments per period
          startDate: periodStart,
          endDate: periodEnd,
          failureRate: adjustedFailureRate,
        });
      }

      const { totalDeployments, failedDeployments, failureRate } =
        calculateFailureRate(deployments);

      const dataPoint: HistoricalDataPoint = {
        date: periodEnd.toISOString().split('T')[0], // YYYY-MM-DD format
        value: failureRate,
        totalDeployments,
        failedDeployments,
      };

      dataPoints.push(dataPoint);
    }

    // Sort data points chronologically (oldest first)
    dataPoints.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const response: HistoricalDataResponse = {
      data: dataPoints,
      period,
      totalPoints: dataPoints.length,
    };

    return response;
  }
);
