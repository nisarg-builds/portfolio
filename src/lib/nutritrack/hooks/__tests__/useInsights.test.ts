import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { computeWeeklyStats } from '../useInsights';
import type { FoodEntry } from '../../models';

function makeFoodEntry(overrides: Partial<FoodEntry> & { dateKey: string; nutrition: FoodEntry['nutrition'] }): FoodEntry {
  return {
    id: 'test-id',
    userId: 'u1',
    name: 'Test Food',
    mealType: 'lunch',
    source: 'ai_chat',
    loggedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as FoodEntry;
}

describe('computeWeeklyStats', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 9, 12, 0)); // April 9, 2026
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('computes correct averages for 7 days of data', () => {
    const weekEntries: Record<string, FoodEntry[]> = {};
    // Fill all 7 days with 2000 cal each
    const days = ['2026-04-03', '2026-04-04', '2026-04-05', '2026-04-06', '2026-04-07', '2026-04-08', '2026-04-09'];
    for (const day of days) {
      weekEntries[day] = [
        makeFoodEntry({
          dateKey: day,
          nutrition: { calories: 2000, proteinG: 100, carbsG: 200, fatG: 80, fiberG: 0 },
        }),
      ];
    }

    const stats = computeWeeklyStats(weekEntries, 2000, 2500, 0);
    expect(stats.avgCalories).toBe(2000);
    expect(stats.avgProteinG).toBe(100);
    expect(stats.daysLogged).toBe(7);
    expect(stats.daysOnTarget).toBe(7); // all within 100 of 2000
  });

  it('divides averages by daysLogged, not 7, for partial weeks', () => {
    const weekEntries: Record<string, FoodEntry[]> = {
      '2026-04-08': [
        makeFoodEntry({
          dateKey: '2026-04-08',
          nutrition: { calories: 1800, proteinG: 90, carbsG: 180, fatG: 70, fiberG: 0 },
        }),
      ],
      '2026-04-09': [
        makeFoodEntry({
          dateKey: '2026-04-09',
          nutrition: { calories: 2200, proteinG: 110, carbsG: 220, fatG: 90, fiberG: 0 },
        }),
      ],
    };

    const stats = computeWeeklyStats(weekEntries, 2000, 2500, 0);
    expect(stats.daysLogged).toBe(2);
    // Average = (1800 + 2200) / 2 = 2000
    expect(stats.avgCalories).toBe(2000);
    expect(stats.avgProteinG).toBe(100);
  });

  it('returns 0 averages when no days have data', () => {
    const stats = computeWeeklyStats({}, 2000, 2500, 0);
    expect(stats.daysLogged).toBe(0);
    expect(stats.avgCalories).toBe(0);
    expect(stats.avgProteinG).toBe(0);
    expect(stats.avgCarbsG).toBe(0);
    expect(stats.avgFatG).toBe(0);
  });

  it('counts daysOnTarget correctly within 100 kcal tolerance', () => {
    const weekEntries: Record<string, FoodEntry[]> = {
      '2026-04-08': [
        makeFoodEntry({
          dateKey: '2026-04-08',
          nutrition: { calories: 2050, proteinG: 100, carbsG: 200, fatG: 80, fiberG: 0 },
        }),
      ],
      '2026-04-09': [
        makeFoodEntry({
          dateKey: '2026-04-09',
          nutrition: { calories: 2500, proteinG: 100, carbsG: 200, fatG: 80, fiberG: 0 },
        }),
      ],
    };

    const stats = computeWeeklyStats(weekEntries, 2000, 2500, 0);
    expect(stats.daysOnTarget).toBe(1); // 2050 is within 100, 2500 is not
  });

  it('computes projectedWeightChangeKg correctly', () => {
    const weekEntries: Record<string, FoodEntry[]> = {};
    // TDEE 2500, eating 2000 each day = 500 deficit/day = 3500/week
    const days = ['2026-04-03', '2026-04-04', '2026-04-05', '2026-04-06', '2026-04-07', '2026-04-08', '2026-04-09'];
    for (const day of days) {
      weekEntries[day] = [
        makeFoodEntry({
          dateKey: day,
          nutrition: { calories: 2000, proteinG: 100, carbsG: 200, fatG: 80, fiberG: 0 },
        }),
      ];
    }

    const stats = computeWeeklyStats(weekEntries, 2000, 2500, 0);
    // weeklyDeficit = 7 * (2500 - 2000) = 3500
    // projectedWeightChangeKg = 3500 / 7700 ≈ 0.45
    expect(stats.weeklyDeficit).toBe(3500);
    expect(stats.projectedWeightChangeKg).toBe(0.45);
  });
});
