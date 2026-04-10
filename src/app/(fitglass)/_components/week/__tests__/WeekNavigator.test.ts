import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getWeekLabel } from '../WeekNavigator';

describe('getWeekLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 9, 12, 0)); // April 9, 2026
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "This Week" for offset 0', () => {
    expect(getWeekLabel(0)).toBe('This Week');
  });

  it('returns "Last Week" for offset -1', () => {
    expect(getWeekLabel(-1)).toBe('Last Week');
  });

  it('returns a date range for offset -2', () => {
    const label = getWeekLabel(-2);
    // offset -2 => end = April 9 - 14 = March 26, start = March 20
    expect(label).toMatch(/Mar/);
    expect(label).toMatch(/–/); // en-dash separator
  });

  it('returns a date range for offset -3', () => {
    const label = getWeekLabel(-3);
    // Should be a date range string, not "This Week" or "Last Week"
    expect(label).not.toBe('This Week');
    expect(label).not.toBe('Last Week');
    expect(label).toMatch(/–/);
  });
});
