import type { Grouping, SeriesBucket } from '~/utils/df/types';

export function toLocalISO(date: Date): string {
  const tzOffsetMs = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - tzOffsetMs);
  return local.toISOString().replace('Z', '');
}

export function formatDayLabel(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getISOWeek(date: Date): { year: number; week: number } {
  const tmp = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = tmp.getUTCDay() || 7; // Monday=1..Sunday=7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((+tmp - +yearStart) / 86400000 + 1) / 7);
  return { year: tmp.getUTCFullYear(), week: weekNo };
}

export function formatWeekLabel(date: Date): string {
  const { year, week } = getISOWeek(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function formatMonthLabel(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function buildBuckets(
  startDate: Date,
  endDate: Date,
  grouping: Grouping
): SeriesBucket[] {
  const buckets: SeriesBucket[] = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    let label = '';
    let bucketStart = new Date(cursor);
    let bucketEnd: Date;

    if (grouping === 'day') {
      label = formatDayLabel(cursor);
      bucketEnd = new Date(cursor);
      bucketEnd.setDate(bucketEnd.getDate() + 1);
      bucketEnd.setMilliseconds(bucketEnd.getMilliseconds() - 1);
      cursor.setDate(cursor.getDate() + 1);
    } else if (grouping === 'week') {
      label = formatWeekLabel(cursor);
      const day = cursor.getDay();
      const mondayOffset = (day + 6) % 7; // 0 for Monday
      bucketStart = new Date(cursor);
      bucketStart.setDate(bucketStart.getDate() - mondayOffset);
      bucketEnd = new Date(bucketStart);
      bucketEnd.setDate(bucketEnd.getDate() + 7);
      bucketEnd.setMilliseconds(bucketEnd.getMilliseconds() - 1);
      cursor.setDate(bucketStart.getDate() + 7);
    } else {
      label = formatMonthLabel(cursor);
      bucketStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
      bucketEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      bucketEnd.setMilliseconds(bucketEnd.getMilliseconds() - 1);
      cursor.setMonth(cursor.getMonth() + 1);
    }

    buckets.push({
      label,
      start: toLocalISO(bucketStart),
      end: toLocalISO(bucketEnd),
      count: 0,
    });
  }

  return buckets;
}
