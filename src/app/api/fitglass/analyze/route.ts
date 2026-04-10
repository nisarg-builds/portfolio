import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import Anthropic from '@anthropic-ai/sdk';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import type {
  AnalyzeFoodRequest,
  AIFoodResponse,
  UserContext,
} from '@/lib/fitglass/models/chat';
import { buildAugmentedPrompt } from '@/lib/fitglass/constants/prompts';

// ─── Vercel serverless config ───
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

// ─── Rate limit config ───
const RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60 * 60 * 1000, // 1 hour
};

// ─── Auth Verification ───

async function verifyAuth(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('UNAUTHENTICATED');
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    throw new Error('UNAUTHENTICATED');
  }
}

// ─── Rate Limiting (Firestore-persistent) ───

async function checkRateLimit(
  uid: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const db = getAdminDb();
  const ref = db.doc(`rateLimits/${uid}`);

  return db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const now = Date.now();

    if (!doc.exists) {
      tx.set(ref, { count: 1, windowStart: now });
      return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1 };
    }

    const data = doc.data()!;
    const elapsed = now - data.windowStart;

    if (elapsed > RATE_LIMIT.windowMs) {
      tx.update(ref, { count: 1, windowStart: now });
      return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1 };
    }

    if (data.count >= RATE_LIMIT.maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    tx.update(ref, { count: FieldValue.increment(1) });
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - data.count - 1 };
  });
}

// ─── User Context Validation ───

/** Clamp a numeric value to [min, max]. Returns undefined if value is not a number. */
function clampNum(
  value: unknown,
  min: number,
  max: number,
): number | undefined {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  return Math.min(max, Math.max(min, value));
}

function validateUserContext(raw: unknown): UserContext | undefined {
  if (!raw || typeof raw !== 'object') return undefined;

  const ctx = raw as Record<string, unknown>;

  const result: Partial<UserContext> = {};

  // Body stats — clamped to safe ranges
  const weight = clampNum(ctx.weightKg, 30, 300);
  if (weight != null) result.weightKg = weight;

  const height = clampNum(ctx.heightCm, 100, 250);
  if (height != null) result.heightCm = height;

  const age = clampNum(ctx.age, 13, 120);
  if (age != null) result.age = age;

  if (typeof ctx.gender === 'string') result.gender = ctx.gender;
  if (typeof ctx.goal === 'string') result.goal = ctx.goal;

  // Calorie / macro targets and consumed — clamped
  const calorieFields = [
    'dailyCalorieTarget',
    'consumedCalories',
  ] as const;

  for (const field of calorieFields) {
    const v = clampNum(ctx[field], 0, 10_000);
    if (v != null) (result as Record<string, unknown>)[field] = v;
  }

  const macroFields = [
    'proteinTargetG',
    'fatMinG',
    'carbsRemainingG',
    'consumedProteinG',
    'consumedCarbsG',
    'consumedFatG',
  ] as const;

  for (const field of macroFields) {
    const v = clampNum(ctx[field], 0, 2000);
    if (v != null) (result as Record<string, unknown>)[field] = v;
  }

  // Only return if at least one field was valid
  if (Object.keys(result).length === 0) return undefined;

  return result as UserContext;
}

// ─── Input Validation ───

function validateRequest(body: unknown): AnalyzeFoodRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('INVALID_INPUT: Request body must be an object');
  }

  const req = body as Record<string, unknown>;

  if (!req.text && !req.imageBase64) {
    throw new Error('INVALID_INPUT: Either text or imageBase64 is required');
  }

  if (req.text && typeof req.text !== 'string') {
    throw new Error('INVALID_INPUT: text must be a string');
  }

  if (req.text && (req.text as string).length > 1000) {
    throw new Error('INVALID_INPUT: text must be under 1000 characters');
  }

  if (req.imageBase64) {
    if (typeof req.imageBase64 !== 'string') {
      throw new Error('INVALID_INPUT: imageBase64 must be a string');
    }
    if ((req.imageBase64 as string).length > 7_000_000) {
      throw new Error('INVALID_INPUT: Image must be under 5MB');
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (
      !req.imageMediaType ||
      !validTypes.includes(req.imageMediaType as string)
    ) {
      throw new Error(
        'INVALID_INPUT: imageMediaType must be image/jpeg, image/png, or image/webp',
      );
    }
  }

  return {
    text: req.text as string | undefined,
    imageBase64: req.imageBase64 as string | undefined,
    imageMediaType: req.imageMediaType as AnalyzeFoodRequest['imageMediaType'],
    userContext: validateUserContext(req.userContext),
  };
}

// ─── AI Response Validation ───

function validateAIResponse(raw: string): AIFoodResponse {
  let parsed: unknown;
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned invalid JSON');
  }

  const resp = parsed as Record<string, unknown>;

  if (typeof resp.message !== 'string') {
    throw new Error('AI response missing "message" field');
  }
  if (!Array.isArray(resp.foods)) {
    throw new Error('AI response missing "foods" array');
  }

  for (const food of resp.foods) {
    const f = food as Record<string, unknown>;
    if (typeof f.name !== 'string' || f.name.length === 0)
      throw new Error('Food item missing "name"');
    if (typeof f.cal !== 'number' || f.cal < 0)
      throw new Error(`Invalid calories for "${f.name}"`);
    if (typeof f.protein !== 'number' || f.protein < 0)
      throw new Error(`Invalid protein for "${f.name}"`);
    if (typeof f.carbs !== 'number' || f.carbs < 0)
      throw new Error(`Invalid carbs for "${f.name}"`);
    if (typeof f.fat !== 'number' || f.fat < 0)
      throw new Error(`Invalid fat for "${f.name}"`);
  }

  return parsed as AIFoodResponse;
}

// ─── Main Handler ───

export async function POST(request: NextRequest) {
  try {
    // 1. Auth
    let uid: string;
    try {
      uid = await verifyAuth(request);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    // 2. Rate limit
    const rateLimit = await checkRateLimit(uid);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Try again in an hour.' },
        { status: 429 },
      );
    }

    // 3. Validate input
    const body = await request.json();
    let input: AnalyzeFoodRequest;
    try {
      input = validateRequest(body);
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          error: (err as Error).message.replace('INVALID_INPUT: ', ''),
        },
        { status: 400 },
      );
    }

    // 4. Build Claude request
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    const systemPrompt = buildAugmentedPrompt(input.userContext);

    const content: Anthropic.MessageCreateParams['messages'][0]['content'] = [];

    if (input.imageBase64 && input.imageMediaType) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: input.imageMediaType,
          data: input.imageBase64,
        },
      });
    }

    content.push({
      type: 'text',
      text:
        input.text ||
        'What food is in this image? Analyze its nutritional content.',
    });

    // 5. Call Claude
    let aiRawText: string;
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content }],
      });

      aiRawText = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('');
    } catch (err) {
      console.error('Claude API error:', err);
      return NextResponse.json(
        { success: false, error: 'AI analysis failed. Please try again.' },
        { status: 502 },
      );
    }

    // 6. Validate response (with retry)
    let validatedResponse: AIFoodResponse;
    try {
      validatedResponse = validateAIResponse(aiRawText);
    } catch {
      // Retry once with stricter prompt
      try {
        const retryResponse = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system:
            systemPrompt +
            '\n\nCRITICAL: Your previous response was not valid JSON. Return ONLY a JSON object, nothing else.',
          messages: [{ role: 'user', content }],
        });

        const retryText = retryResponse.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('');

        validatedResponse = validateAIResponse(retryText);
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: 'Could not parse nutrition data. Please try again.',
          },
          { status: 502 },
        );
      }
    }

    // 7. Return
    return NextResponse.json({
      success: true,
      data: validatedResponse,
      rateLimitRemaining: rateLimit.remaining,
    });
  } catch (err) {
    console.error('Unhandled error in /api/fitglass/analyze:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
