import { labels } from '../shared/labels';

export const TZ = labels.timeZone;

/** Returns midnight (start of day) as a UTC Date for a "YYYY-MM-DD" string, resolved in TZ. */
export function tzMidnight(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const utcMidnight = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  const rawHour = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', hour12: false, timeZone: TZ,
  }).format(utcMidnight);
  const tzHour = parseInt(rawHour, 10) % 24;
  return new Date(utcMidnight.getTime() - tzHour * 3_600_000);
}

/** Today's date string in TZ ("YYYY-MM-DD"). */
export function todayStr(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ });
}

/** Day-of-week (0=Sun…6=Sat) for a "YYYY-MM-DD" string. */
export function dayOfWeek(dateStr: string): number {
  return new Date(`${dateStr}T12:00:00`).getDay();
}

/** Advance baseStr by daysAhead working days (skips Sat/Sun). */
export function addWorkdays(baseStr: string, daysAhead: number): string {
  const [y, m, d] = baseStr.split('-').map(Number);
  let date = new Date(Date.UTC(y, m - 1, d));
  let added = 0;
  while (added < daysAhead) {
    date = new Date(date.getTime() + 86_400_000);
    const dow = date.getUTCDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return date.toISOString().split('T')[0];
}

/** Resolve a human-readable day label for a date string relative to today. */
export function resolveDayLabel(dateStr: string): string {
  const today = todayStr();
  if (dateStr === today) return labels.today;
  const diff = Math.round(
    (new Date(`${dateStr}T12:00:00`).getTime() - new Date(`${today}T12:00:00`).getTime()) /
      86_400_000,
  );
  if (diff === 1) return labels.tomorrow;
  return labels.dayNames[dayOfWeek(dateStr)];
}
