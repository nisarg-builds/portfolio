/**
 * Supported fitness goals.
 * Determines calorie target calculation (surplus vs deficit vs maintenance).
 */
export type FitnessGoal = 'fat_loss' | 'muscle_gain' | 'maintenance';

/**
 * Gender for BMR calculation (Mifflin-St Jeor equation).
 * Affects the +5 / -161 constant.
 */
export type Gender = 'male' | 'female';

/**
 * Activity level multiplier applied to BMR to get TDEE.
 * Based on the Harris-Benedict revised activity factors.
 */
export interface ActivityLevel {
  /** Unique identifier, e.g. 'sedentary', 'light', 'moderate', 'very_active'. */
  id: string;
  /** Human-readable label, e.g. 'Sedentary (desk job, little exercise)'. */
  label: string;
  /** Multiplier applied to BMR, e.g. 1.2, 1.375, 1.55, 1.725. */
  multiplier: number;
}

/**
 * Core user profile. Stored in Firestore at /users/{uid}/profile/main.
 *
 * All measurements are metric (kg, cm). The UI can offer imperial input
 * but must convert before storing.
 */
export interface UserProfile {
  /** Firebase Auth UID. */
  userId: string;
  /** Display name from Firebase Auth or user-provided. */
  displayName: string;
  /** Email from Firebase Auth. */
  email: string;

  /** Current weight in kg. Range: 30-300. */
  weightKg: number;
  /** Height in cm. Range: 100-250. */
  heightCm: number;
  /** Age in years. Range: 13-120. */
  age: number;
  /** Biological gender for BMR calculation. */
  gender: Gender;

  /** User's fitness goal. */
  goal: FitnessGoal;
  /** References an ActivityLevel.id. */
  activityLevelId: string;
  /** Target weight change rate in kg/week. Range: 0.1-1.0. */
  goalRateKgPerWeek: number;

  /** UI display preference only — storage is always metric. */
  preferredUnits: 'metric' | 'imperial';

  /** Firestore Timestamp — when the profile was created. */
  createdAt: Date;
  /** Firestore Timestamp — when the profile was last updated. */
  updatedAt: Date;
}

/**
 * Computed targets derived from UserProfile.
 * NOT stored in Firestore — calculated on the client.
 */
export interface ComputedTargets {
  /** Basal Metabolic Rate (kcal). */
  bmr: number;
  /** Total Daily Energy Expenditure (kcal). */
  tdee: number;
  /** TDEE adjusted for goal (kcal). */
  dailyCalorieTarget: number;
  /** Difference between TDEE and target (kcal). */
  dailyDeficit: number;
  /** Protein target — ~1.8g per kg bodyweight. */
  proteinTargetG: number;
  /** Minimum fat intake — ~0.8g per kg bodyweight (floor). */
  fatMinG: number;
  /** Remaining calories allocated to carbs (g). */
  carbsRemainingG: number;
}
