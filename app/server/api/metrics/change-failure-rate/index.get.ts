import type { ChangeFailureRateResponse } from '~/types/metrics';
import type { TimePeriod } from '~/types/common';
import { TimePeriodType, DataQualityStatus } from '~/types/enums';
import {
  generateMockDeployments,
  getDeploymentsInPeriod,
  calculateFailureRate,
} from '~/server/utils/mockDeploymentData';

export default defineEventHandler(
  async (event): Promise<ChangeFailureRateResponse> => {
    const query = getQuery(event);

    // Parse query parameters
    const period = (query.period as string) || 'monthly';
    const startDateParam = query.startDate as string;
    const endDateParam = query.endDate as string;

    // Validate period parameter
    if (!Object.values(TimePeriodType).includes(period as TimePeriodType)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid period parameter. Must be one of: ${Object.values(TimePeriodType).join(', ')}`,
      });
    }

    // Calculate time period
    let startDate: Date;
    let endDate: Date = new Date();
    let label: string;

    if (startDateParam && endDateParam) {
      // Custom date range
      try {
        startDate = new Date(startDateParam);
        endDate = new Date(endDateParam);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error('Invalid date format');
        }

        if (startDate >= endDate) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Start date must be before end date',
          });
        }

        label = `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`;
      } catch (error) {
        throw createError({
          statusCode: 400,
          statusMessage:
            'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)',
        });
      }
    } else {
      // Predefined period
      const now = new Date();
      switch (period as TimePeriodType) {
        case TimePeriodType.DAILY:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          label = 'Last 24 hours';
          break;
        case TimePeriodType.WEEKLY:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          label = 'Last 7 days';
          break;
        case TimePeriodType.MONTHLY:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          label = 'Last 30 days';
          break;
        case TimePeriodType.QUARTERLY:
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          label = 'Last 90 days';
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          label = 'Last 30 days';
      }
    }

    // Generate mock deployment data
    const allDeployments = generateMockDeployments({
      count: 200,
      startDate: new Date(startDate.getTime() - 60 * 24 * 60 * 60 * 1000), // Extra data for context
      endDate,
      failureRate: 15, // 15% failure rate
    });

    // Filter deployments for the requested period
    const periodDeployments = getDeploymentsInPeriod(
      allDeployments,
      startDate,
      endDate
    );

    // Calculate failure rate
    const { totalDeployments, failedDeployments, failureRate } =
      calculateFailureRate(periodDeployments);

    // Determine data quality
    let dataQuality: DataQualityStatus;
    if (totalDeployments >= 50) {
      dataQuality = DataQualityStatus.COMPLETE;
    } else if (totalDeployments >= 10) {
      dataQuality = DataQualityStatus.PARTIAL;
    } else {
      dataQuality = DataQualityStatus.INSUFFICIENT;
    }

    const timePeriod: TimePeriod = {
      startDate,
      endDate,
      type: period as TimePeriodType,
      label,
    };

    const response: ChangeFailureRateResponse = {
      metric: {
        value: failureRate,
        period: timePeriod,
        totalDeployments,
        failedDeployments,
        calculatedAt: new Date(),
        dataQuality,
      },
      period: timePeriod,
      dataQuality,
      lastUpdated: new Date().toISOString(),
    };

    return response;
  }
);
