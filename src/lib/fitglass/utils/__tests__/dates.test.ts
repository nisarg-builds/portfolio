import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDateKey, getLastNDays, formatDateKey, isToday } from '../dates';

describe('getDateKey', () => {
  it('returns YYYY-MM-DD format for a given date', () => {
    const date = new Date(2026, 3, 9); // April 9, 2026
    expect(getDateKey(date)).toBe('2026-04-09');
  });

  it('zero-pads single-digit month and day', () => {
    const date = new Date(2026, 0, 5); // January 5, 2026
    expect(getDateKey(date)).toBe('2026-01-05');
  });

  it('defaults to current date when no argument', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 9, 14, 30));
    expect(getDateKey()).toBe('2026-04-09');
    vi.useRealTimers();
  });
});

describe('getLastNDays', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 9, 12, 0)); // April 9, 2026 noon
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 7 date keys ending at today for offset=0', () => {
    const days = getLastNDays(7, 0);
    expect(days).toHaveLength(7);
    expect(days[0]).toBe('2026-04-03');
    expect(days[6]).toBe('2026-04-09');
  });

  it('returns oldest first', () => {
    const days = getLastNDays(7, 0);
    expect(days[0] < days[6]).toBe(true);
  });

  it('returns 7 keys ending 7 days ago for offset=-1', () => {
    const days = getLastNDays(7, -1);
    expect(days).toHaveLength(7);
    expect(days[6]).toBe('2026-04-02');
    expect(days[0]).toBe('2026-03-27');
  });

  it('handles month boundary — March 3 includes Feb dates', () => {
    vi.setSystemTime(new Date(2026, 2, 3, 12, 0)); // March 3, 2026
    const days = getLastNDays(7, 0);
    expect(days[0]).toBe('2026-02-25');
    expect(days[6]).toBe('2026-03-03');
  });

  it('handles year boundary — Jan 3 includes Dec dates', () => {
    vi.setSystemTime(new Date(2026, 0, 3, 12, 0)); // January 3, 2026
    const days = getLastNDays(7, 0);
    expect(days[0]).toBe('2025-12-28');
    expect(days[6]).toBe('2026-01-03');
  });
});

describe('formatDateKey', () => {
  it('formats a date key as weekday, month day', () => {
    const result = formatDateKey('2026-04-09');
    // Thu, Apr 9
    expect(result).toMatch(/Thu/);
    expect(result).toMatch(/Apr/);
    expect(result).toMatch(/9/);
  });
});

describe('isToday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 9, 14, 30));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for today\'s date key', () => {
    expect(isToday('2026-04-09')).toBe(true);
  });

  it('returns false for yesterday\'s date key', () => {
    expect(isToday('2026-04-08')).toBe(false);
  });
});
