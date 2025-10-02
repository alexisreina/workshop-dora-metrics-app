import type { RollingPoint, SeriesBucket } from '~/utils/df/types';

export function computeSevenDayRollingAverage(
  buckets: SeriesBucket[]
): RollingPoint[] {
  const values = buckets.map((b) => b.count);
  const labels = buckets.map((b) => b.label);
  const result: RollingPoint[] = [];

  let windowSum = 0;
  const window: number[] = [];

  for (let i = 0; i < values.length; i++) {
    window.push(values[i]);
    windowSum += values[i];

    if (window.length > 7) {
      windowSum -= window.shift() as number;
    }

    const divisor = Math.min(7, window.length);
    result.push({ label: labels[i], value: windowSum / divisor });
  }

  return result;
}
