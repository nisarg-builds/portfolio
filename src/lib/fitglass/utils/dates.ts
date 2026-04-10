/** Get a date key string in YYYY-MM-DD format (local timezone). */
export function getDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format a date key for display. '2026-04-08' -> 'Wed, Apr 8' */
export function formatDateKey(dateKey: string): string {
  const date = new Date(dateKey + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Get date keys for the last N days (including today). Oldest first. */
export function getLastNDays(n: number, offset = 0): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i + offset * 7);
    days.push(getDateKey(d));
  }
  return days;
}

/** Check if a date key is today. */
export function isToday(dateKey: string): boolean {
  return dateKey === getDateKey();
}
