# FitGlass — API Route & AI Service

> Next.js API Route handler that proxies Claude API requests. Replaces Firebase Cloud Functions.
> Uses the portfolio's existing `firebase-admin` package for auth verification and rate limiting.

---

## 1. API Route: `POST /api/fitglass/analyze`

### 1.1 Overview

A Next.js App Router API route that:
1. Verifies the caller's Firebase ID token (using `firebase-admin`)
2. Checks per-user rate limits (Firestore counter via admin SDK)
3. Validates the request payload
4. Calls the Anthropic Claude API with the food analysis system prompt
5. Validates the response JSON
6. Returns structured nutrition data to the client

### 1.2 Route Configuration

```typescript
// app/api/fitglass/analyze/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import Anthropic from '@anthropic-ai/sdk';

// ─── Ensure firebase-admin is initialized ───
// The portfolio likely already initializes this in a shared lib file.
// Import that initialization here, e.g.:
// import '@/lib/firebase-admin';
//
// If not, initialize here:
// import { initializeApp, getApps, cert } from 'firebase-admin/app';
// if (!getApps().length) {
//   initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIAL!)) });
// }

// ─── Vercel serverless config ───
export const maxDuration = 30; // seconds (default is 10, Claude needs more)
export const dynamic = 'force-dynamic'; // no caching

// ─── Types ───

interface AnalyzeFoodRequest {
  text?: string;
  imageBase64?: string;
  imageMediaType?: 'image/jpeg' | 'image/png' | 'image/webp';
}

interface AIFoodItem {
  name: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
}

interface AIFoodResponse {
  message: string;
  foods: AIFoodItem[];
}

// ─── System Prompt ───

const FOOD_ANALYSIS_PROMPT = `You are a nutrition analysis assistant. Your job is to identify foods and estimate their nutritional content accurately.

When the user describes food or shows you an image of food:
1. Identify each distinct food item
2. Estimate reasonable portion sizes based on typical servings
3. Provide nutritional breakdown per item

You MUST respond ONLY with valid JSON. No markdown, no backticks, no preamble, no explanation outside the JSON.

Use this exact schema:
{
  "message": "A brief friendly comment about the food (1-2 sentences max)",
  "foods": [
    {
      "name": "Food item name with estimated portion size",
      "cal": 250,
      "protein": 20,
      "carbs": 10,
      "fat": 12,
      "fiber": 3,
      "sugar": 2,
      "sodium": 400,
      "vitaminA": 10,
      "vitaminC": 15,
      "calcium": 8,
      "iron": 12
    }
  ]
}

Field rules:
- "cal" = kilocalories (integer)
- "protein", "carbs", "fat", "fiber", "sugar" = grams (1 decimal max)
- "sodium" = milligrams (integer)
- "vitaminA", "vitaminC", "calcium", "iron" = percentage of daily value, 0-100 (integer)
- All numeric fields must be numbers, never strings
- If you cannot identify a food, return { "message": "explanation", "foods": [] }
- If multiple items visible, list each separately
- Use standard serving sizes unless the user specifies otherwise
- Round to reasonable precision (no false precision like 23.847g)
- ONLY output the JSON object. Nothing else.`;

// ─── Auth Verification ───

async function verifyAuth(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('UNAUTHENTICATED');
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    throw new Error('UNAUTHENTICATED');
  }
}

// ─── Rate Limiting ───

const RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60 * 60 * 1000, // 1 hour
};

async function checkRateLimit(uid: string): Promise<{ allowed: boolean; remaining: number }> {
  const db = getFirestore();
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
    if (!req.imageMediaType || !validTypes.includes(req.imageMediaType as string)) {
      throw new Error('INVALID_INPUT: imageMediaType must be image/jpeg, image/png, or image/webp');
    }
  }

  return {
    text: req.text as string | undefined,
    imageBase64: req.imageBase64 as string | undefined,
    imageMediaType: req.imageMediaType as AnalyzeFoodRequest['imageMediaType'],
  };
}

// ─── Response Validation ───

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
    if (typeof f.name !== 'string' || f.name.length === 0) throw new Error('Food item missing "name"');
    if (typeof f.cal !== 'number' || f.cal < 0) throw new Error(`Invalid calories for "${f.name}"`);
    if (typeof f.protein !== 'number' || f.protein < 0) throw new Error(`Invalid protein for "${f.name}"`);
    if (typeof f.carbs !== 'number' || f.carbs < 0) throw new Error(`Invalid carbs for "${f.name}"`);
    if (typeof f.fat !== 'number' || f.fat < 0) throw new Error(`Invalid fat for "${f.name}"`);
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
        { success: false, error: (err as Error).message.replace('INVALID_INPUT: ', '') },
        { status: 400 },
      );
    }

    // 4. Build Claude request
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

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
      text: input.text || 'What food is in this image? Analyze its nutritional content.',
    });

    // 5. Call Claude
    let aiRawText: string;
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: FOOD_ANALYSIS_PROMPT,
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
          system: FOOD_ANALYSIS_PROMPT + '\n\nCRITICAL: Your previous response was not valid JSON. Return ONLY a JSON object, nothing else.',
          messages: [{ role: 'user', content }],
        });

        const retryText = retryResponse.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('');

        validatedResponse = validateAIResponse(retryText);
      } catch {
        return NextResponse.json(
          { success: false, error: 'Could not parse nutrition data. Please try again.' },
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
```

### 1.3 New Dependency

```bash
npm install @anthropic-ai/sdk
```

This is the only new server-side dependency. `firebase-admin` is already installed in the portfolio.

---

## 2. Client-Side AI Service

```typescript
// lib/fitglass/services/ai.ts

import { getAuth } from 'firebase/auth';
import type { AnalyzeFoodResponse } from '../models/chat';

/**
 * Call the FitGlass API route to analyze food.
 * Sends the Firebase ID token for authentication.
 */
export async function analyzeFood(
  text?: string,
  imageBase64?: string,
  imageMediaType?: 'image/jpeg' | 'image/png' | 'image/webp',
): Promise<AnalyzeFoodResponse> {
  // Get current user's ID token
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Please sign in to use the AI food analyzer.');
  }

  const idToken = await user.getIdToken();

  const response = await fetch('/api/fitglass/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ text, imageBase64, imageMediaType }),
  });

  const data: AnalyzeFoodResponse = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to use the AI food analyzer.');
    }
    if (response.status === 429) {
      throw new Error("You've reached the hourly limit. Please try again later.");
    }
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data;
}

/**
 * Convert a File object to base64 string (without data URL prefix).
 * Auto-resizes if over maxSizeBytes.
 */
export async function fileToBase64(
  file: File,
  maxSizeBytes = 5_000_000,
): Promise<{
  base64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp';
}> {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
  if (!validTypes.includes(file.type as (typeof validTypes)[number])) {
    throw new Error('Please upload a JPEG, PNG, or WebP image.');
  }

  let processedFile = file;
  if (file.size > maxSizeBytes) {
    processedFile = await resizeImage(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve({
        base64,
        mediaType: file.type as (typeof validTypes)[number],
      });
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(processedFile);
  });
}

/**
 * Resize an image by reducing dimensions and quality.
 */
async function resizeImage(file: File): Promise<File> {
  const img = new Image();
  const url = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      const maxDim = 1920;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Failed to resize image'));
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.7,
      );
    };
    img.onerror = () => reject(new Error('Failed to load image for resizing'));
    img.src = url;
  });
}
```

---

## 3. Firebase Client SDK Setup

The portfolio uses `firebase-admin` server-side. FitGlass needs the `firebase` client SDK for Auth and Firestore realtime listeners in the browser.

```typescript
// lib/fitglass/services/firebase-client.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize only once (handles HMR and multiple imports)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore with offline persistence
// NOTE: initializeFirestore can only be called once. After that, use getFirestore.
let db: ReturnType<typeof getFirestore>;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch {
  // Already initialized (HMR), just get the instance
  db = getFirestore(app);
}

export { db };

// ─── Collection helpers ───

import { doc, collection } from 'firebase/firestore';

export function getUserProfileRef(uid: string) {
  return doc(db, 'users', uid, 'profile', 'main');
}

export function getFoodLogCollection(uid: string) {
  return collection(db, 'users', uid, 'foodLog');
}

export function getQuickFoodsCollection(uid: string) {
  return collection(db, 'users', uid, 'quickFoods');
}
```

---

## 4. Environment Variables

Add to `.env.local` and Vercel project settings:

```env
# ─── Firebase Client SDK (NEXT_PUBLIC_ = exposed to browser, safe for Firebase client config) ───
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# ─── Anthropic API (server-side only, NO NEXT_PUBLIC_ prefix) ───
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 5. Cost Estimation

| Service | Free Tier | Estimated Monthly Cost (personal use) |
|---------|-----------|--------------------------------------|
| Firestore reads | 50k/day | $0 |
| Firestore writes | 20k/day | $0 |
| Vercel serverless | Hobby plan included | $0 |
| Claude API (Sonnet) | — | ~$2-5 (est. 200-500 requests) |
| Firebase Auth | 10k users free | $0 |
| **Total** | | **~$2-5/mo** |
