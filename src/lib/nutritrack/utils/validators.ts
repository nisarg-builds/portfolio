export interface ValidationResult {
  /** Whether all validations passed. */
  valid: boolean;
  /** List of human-readable error messages. */
  errors: string[];
}

/** Validate user profile fields against allowed ranges. */
export function validateProfile(profile: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: string;
  goalRateKgPerWeek: number;
}): ValidationResult {
  const errors: string[] = [];

  if (!profile.weightKg || profile.weightKg < 30 || profile.weightKg > 300)
    errors.push('Weight must be between 30 and 300 kg');
  if (!profile.heightCm || profile.heightCm < 100 || profile.heightCm > 250)
    errors.push('Height must be between 100 and 250 cm');
  if (!profile.age || profile.age < 13 || profile.age > 120)
    errors.push('Age must be between 13 and 120');
  if (!['male', 'female'].includes(profile.gender))
    errors.push('Gender must be male or female');
  if (
    !profile.goalRateKgPerWeek ||
    profile.goalRateKgPerWeek < 0.1 ||
    profile.goalRateKgPerWeek > 1.0
  )
    errors.push('Goal rate must be between 0.1 and 1.0 kg/week');

  return { valid: errors.length === 0, errors };
}

/** Validate a food entry's required fields against allowed ranges. */
export function validateFoodEntry(entry: {
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}): ValidationResult {
  const errors: string[] = [];

  if (!entry.name || entry.name.trim().length === 0) errors.push('Food name is required');
  if (entry.name && entry.name.length > 200) errors.push('Food name must be under 200 characters');
  if (entry.calories < 0 || entry.calories > 5000)
    errors.push('Calories must be between 0 and 5000');
  if (entry.proteinG < 0 || entry.proteinG > 500)
    errors.push('Protein must be between 0 and 500g');
  if (entry.carbsG < 0 || entry.carbsG > 500) errors.push('Carbs must be between 0 and 500g');
  if (entry.fatG < 0 || entry.fatG > 500) errors.push('Fat must be between 0 and 500g');

  return { valid: errors.length === 0, errors };
}
