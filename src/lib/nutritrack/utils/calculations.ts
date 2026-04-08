import type { ComputedTargets } from '../models';

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation.
 *
 * Male:   BMR = (10 x weight_kg) + (6.25 x height_cm) - (5 x age) + 5
 * Female: BMR = (10 x weight_kg) + (6.25 x height_cm) - (5 x age) - 161
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

/**
 * Calculate Total Daily Energy Expenditure.
 * TDEE = BMR x activity multiplier.
 */
export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activityMultiplier: number,
): number {
  return Math.round(calculateBMR(weightKg, heightCm, age, gender) * activityMultiplier);
}

/**
 * Calculate daily calorie target based on goal.
 *
 * Fat loss:     TDEE - (goalRate x 7700 / 7)  — floor 1200 kcal
 * Muscle gain:  TDEE + (goalRate x 7700 / 7 x 0.5)  — cap surplus at 500
 * Maintenance:  TDEE
 */
export function calculateDailyTarget(
  tdee: number,
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance',
  goalRateKgPerWeek: number,
): number {
  switch (goal) {
    case 'fat_loss': {
      const deficit = Math.round((goalRateKgPerWeek * 7700) / 7);
      return Math.max(1200, tdee - deficit);
    }
    case 'muscle_gain': {
      const surplus = Math.round(((goalRateKgPerWeek * 7700) / 7) * 0.5);
      return tdee + Math.min(surplus, 500);
    }
    case 'maintenance':
      return tdee;
  }
}

/**
 * Calculate recommended macro targets.
 *
 * Protein: 1.8g/kg (high for muscle preservation)
 * Fat:     0.8g/kg (minimum for hormonal health)
 * Carbs:   remaining calories
 */
export function calculateMacroTargets(
  dailyCalorieTarget: number,
  weightKg: number,
): { proteinG: number; fatG: number; carbsG: number } {
  const proteinG = Math.round(weightKg * 1.8);
  const fatG = Math.round(weightKg * 0.8);
  const proteinCals = proteinG * 4;
  const fatCals = fatG * 9;
  const carbsCals = Math.max(0, dailyCalorieTarget - proteinCals - fatCals);
  const carbsG = Math.round(carbsCals / 4);

  return { proteinG, fatG, carbsG };
}

/**
 * Compute all targets from a profile. Single entry point for the UI.
 */
export function computeAllTargets(profile: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female';
  activityMultiplier: number;
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance';
  goalRateKgPerWeek: number;
}): ComputedTargets {
  const bmr = calculateBMR(profile.weightKg, profile.heightCm, profile.age, profile.gender);
  const tdee = Math.round(bmr * profile.activityMultiplier);
  const dailyCalorieTarget = calculateDailyTarget(tdee, profile.goal, profile.goalRateKgPerWeek);
  const dailyDeficit = tdee - dailyCalorieTarget;
  const macros = calculateMacroTargets(dailyCalorieTarget, profile.weightKg);

  return {
    bmr,
    tdee,
    dailyCalorieTarget,
    dailyDeficit,
    proteinTargetG: macros.proteinG,
    fatMinG: macros.fatG,
    carbsRemainingG: macros.carbsG,
  };
}
