/**
 * A single food item returned by the AI analysis.
 */
export interface AIFoodItem {
  /** Food name with estimated portion size. */
  name: string;
  /** Kilocalories (integer). */
  cal: number;
  /** Protein in grams (1 decimal max). */
  protein: number;
  /** Carbohydrates in grams (1 decimal max). */
  carbs: number;
  /** Fat in grams (1 decimal max). */
  fat: number;
  /** Dietary fiber in grams. */
  fiber?: number;
  /** Sugar in grams. */
  sugar?: number;
  /** Sodium in milligrams. */
  sodium?: number;
  /** Vitamin A as % of daily value (0-100). */
  vitaminA?: number;
  /** Vitamin C as % of daily value (0-100). */
  vitaminC?: number;
  /** Calcium as % of daily value (0-100). */
  calcium?: number;
  /** Iron as % of daily value (0-100). */
  iron?: number;
}

/**
 * The full response from the AI food analysis endpoint.
 */
export interface AIFoodResponse {
  /** Brief friendly comment about the food (1-2 sentences). */
  message: string;
  /** Array of identified food items with nutrition data. */
  foods: AIFoodItem[];
}

/**
 * A single message in the chat interface.
 * Chat messages are ephemeral (session-only) — NOT persisted to Firestore.
 */
export interface ChatMessage {
  /** Unique message identifier. */
  id: string;
  /** Whether this message is from the user or the AI assistant. */
  role: 'user' | 'assistant';
  /** Text content of the message. */
  text: string;
  /** When the message was created. */
  timestamp: Date;

  /** Base64 data URL of an attached image (user messages). */
  imageDataUrl?: string;
  /** Original File object of an attached image (user messages). */
  imageFile?: File;

  /** Parsed food items from AI response (assistant messages). */
  foods?: AIFoodItem[];
  /** Whether this message is currently loading (assistant messages). */
  isLoading?: boolean;
  /** Whether this message encountered an error (assistant messages). */
  isError?: boolean;
}

/**
 * User's profile, targets, and today's consumed totals.
 * Sent with food analysis requests so the AI can give contextual advice.
 * Contains only nutritional data — no PII (userId, email, displayName).
 */
export interface UserContext {
  dailyCalorieTarget?: number;
  proteinTargetG?: number;
  fatMinG?: number;
  carbsRemainingG?: number;
  consumedCalories?: number;
  consumedProteinG?: number;
  consumedCarbsG?: number;
  consumedFatG?: number;
  goal?: string;
  weightKg?: number;
  heightCm?: number;
  age?: number;
  gender?: string;
}

/**
 * Request body sent to POST /api/fitglass/analyze.
 */
export interface AnalyzeFoodRequest {
  /** Text description of the food to analyze. */
  text?: string;
  /** Base64-encoded image data (without data URL prefix). */
  imageBase64?: string;
  /** MIME type of the image. */
  imageMediaType?: 'image/jpeg' | 'image/png' | 'image/webp';
  /** User's profile context for personalized AI responses. */
  userContext?: UserContext;
}

/**
 * Response body from POST /api/fitglass/analyze.
 */
export interface AnalyzeFoodResponse {
  /** Whether the analysis was successful. */
  success: boolean;
  /** Parsed AI response data (present on success). */
  data?: AIFoodResponse;
  /** Error message (present on failure). */
  error?: string;
  /** Number of API requests remaining in the current rate limit window. */
  rateLimitRemaining?: number;
}
