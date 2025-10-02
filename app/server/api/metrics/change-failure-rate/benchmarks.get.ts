import type { BenchmarkResponse } from '~/types/common';
import { getBenchmarkResponse } from '~/server/utils/benchmarkData';

export default defineEventHandler(async (event): Promise<BenchmarkResponse> => {
  try {
    // Return the static benchmark data
    const response = getBenchmarkResponse();

    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve benchmark data',
    });
  }
});
