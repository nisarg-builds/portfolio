import { describe, it, expect } from 'vitest';
import { computeMacroTotals } from '../useTodayMacros';

describe('computeMacroTotals', () => {
  it('sums and rounds macros from multiple entries', () => {
    const entries = [
      { nutrition: { calories: 500.4, proteinG: 30.3, carbsG: 60.7, fatG: 15.2, fiberG: 5 } },
      { nutrition: { calories: 350.6, proteinG: 20.7, carbsG: 40.3, fatG: 10.8, fiberG: 3 } },
    ];

    const result = computeMacroTotals(entries);
    expect(result.consumed).toBe(851); // Math.round(500.4 + 350.6)
    expect(result.proteinG).toBe(51); // Math.round(30.3 + 20.7)
    expect(result.carbsG).toBe(101); // Math.round(60.7 + 40.3)
    expect(result.fatG).toBe(26); // Math.round(15.2 + 10.8)
  });

  it('returns all zeros for empty array', () => {
    const result = computeMacroTotals([]);
    expect(result.consumed).toBe(0);
    expect(result.proteinG).toBe(0);
    expect(result.carbsG).toBe(0);
    expect(result.fatG).toBe(0);
  });

  it('handles a single entry', () => {
    const entries = [
      { nutrition: { calories: 250, proteinG: 15, carbsG: 30, fatG: 8, fiberG: 2 } },
    ];

    const result = computeMacroTotals(entries);
    expect(result.consumed).toBe(250);
    expect(result.proteinG).toBe(15);
    expect(result.carbsG).toBe(30);
    expect(result.fatG).toBe(8);
  });

  it('rounds correctly at .5 boundary', () => {
    const entries = [
      { nutrition: { calories: 10.5, proteinG: 10.5, carbsG: 10.5, fatG: 10.5, fiberG: 0 } },
    ];

    const result = computeMacroTotals(entries);
    // Math.round(10.5) = 11 in JS
    expect(result.consumed).toBe(11);
    expect(result.proteinG).toBe(11);
  });
});
