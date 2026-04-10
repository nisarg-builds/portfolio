import { describe, it, expect } from 'vitest';
import {
  calculateBMR,
  calculateTDEE,
  calculateDailyTarget,
  calculateMacroTargets,
  computeAllTargets,
} from '../calculations';

describe('calculateBMR', () => {
  it('calculates correctly for a 80kg, 175cm, 25yo male', () => {
    expect(calculateBMR(80, 175, 25, 'male')).toBe(1774);
  });

  it('calculates correctly for a 60kg, 165cm, 30yo female', () => {
    expect(calculateBMR(60, 165, 30, 'female')).toBe(1320);
  });
});

describe('calculateTDEE', () => {
  it('applies activity multiplier to BMR', () => {
    // 80kg, 175cm, 25yo male -> BMR 1774, moderate (1.55) -> 2750
    expect(calculateTDEE(80, 175, 25, 'male', 1.55)).toBe(2750);
  });

  it('applies sedentary multiplier', () => {
    // 60kg, 165cm, 30yo female -> BMR 1320, sedentary (1.2) -> 1584
    expect(calculateTDEE(60, 165, 30, 'female', 1.2)).toBe(1584);
  });
});

describe('calculateDailyTarget', () => {
  it('applies correct deficit for fat loss', () => {
    // 0.5 kg/week * 7700 / 7 = 550 deficit -> 2500 - 550 = 1950
    expect(calculateDailyTarget(2500, 'fat_loss', 0.5)).toBe(1950);
  });

  it('enforces 1200 kcal floor', () => {
    // 1.0 kg/week * 7700 / 7 = 1100 deficit -> 1400 - 1100 = 300 -> clamped to 1200
    expect(calculateDailyTarget(1400, 'fat_loss', 1.0)).toBe(1200);
  });

  it('returns TDEE for maintenance', () => {
    expect(calculateDailyTarget(2200, 'maintenance', 0)).toBe(2200);
  });

  it('applies halved surplus for muscle gain', () => {
    // 0.5 kg/week * 7700 / 7 * 0.5 = 275 surplus -> 2500 + 275 = 2775
    expect(calculateDailyTarget(2500, 'muscle_gain', 0.5)).toBe(2775);
  });

  it('caps muscle gain surplus at 500', () => {
    // 1.0 kg/week * 7700 / 7 * 0.5 = 550 surplus -> capped to 500 -> 2500 + 500 = 3000
    expect(calculateDailyTarget(2500, 'muscle_gain', 1.0)).toBe(3000);
  });
});

describe('calculateMacroTargets', () => {
  it('calculates protein at 1.8g/kg', () => {
    const macros = calculateMacroTargets(2000, 80);
    expect(macros.proteinG).toBe(144); // 80 * 1.8
  });

  it('calculates fat at 0.8g/kg', () => {
    const macros = calculateMacroTargets(2000, 80);
    expect(macros.fatG).toBe(64); // 80 * 0.8
  });

  it('allocates remaining calories to carbs', () => {
    const macros = calculateMacroTargets(2000, 80);
    // protein: 144 * 4 = 576, fat: 64 * 9 = 576, remaining: 2000 - 576 - 576 = 848, carbs: 848/4 = 212
    expect(macros.carbsG).toBe(212);
  });

  it('floors carbs at 0 when protein + fat exceed budget', () => {
    const macros = calculateMacroTargets(1200, 120);
    // protein: 216 * 4 = 864, fat: 96 * 9 = 864, total = 1728 > 1200 -> carbs = 0
    expect(macros.carbsG).toBe(0);
  });
});

describe('computeAllTargets', () => {
  it('computes full target set for a fat loss profile', () => {
    const targets = computeAllTargets({
      weightKg: 80,
      heightCm: 175,
      age: 25,
      gender: 'male',
      activityMultiplier: 1.55,
      goal: 'fat_loss',
      goalRateKgPerWeek: 0.5,
    });

    expect(targets.bmr).toBe(1774);
    expect(targets.tdee).toBe(2750);
    expect(targets.dailyCalorieTarget).toBe(2200);
    expect(targets.dailyDeficit).toBe(550);
    expect(targets.proteinTargetG).toBe(144);
    expect(targets.fatMinG).toBe(64);
  });

  it('returns zero deficit for maintenance', () => {
    const targets = computeAllTargets({
      weightKg: 70,
      heightCm: 170,
      age: 30,
      gender: 'female',
      activityMultiplier: 1.375,
      goal: 'maintenance',
      goalRateKgPerWeek: 0,
    });

    expect(targets.dailyDeficit).toBe(0);
    expect(targets.dailyCalorieTarget).toBe(targets.tdee);
  });
});
