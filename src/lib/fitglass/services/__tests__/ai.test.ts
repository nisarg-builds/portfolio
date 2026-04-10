import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { UserContext } from '../../models/chat';

// Mock firebase-client before importing the module under test
vi.mock('../firebase-client', () => ({
  getFirebaseAuth: () => ({
    currentUser: {
      getIdToken: () => Promise.resolve('mock-id-token'),
    },
  }),
}));

// Must import after mocks are set up
const { analyzeFood } = await import('../ai');

const mockResponse = {
  success: true,
  data: {
    message: 'Found 1 item',
    foods: [{ name: 'Apple', cal: 95, protein: 0.5, carbs: 25, fat: 0.3 }],
  },
};

const sampleUserContext: UserContext = {
  dailyCalorieTarget: 2000,
  proteinTargetG: 150,
  fatMinG: 55,
  carbsRemainingG: 200,
  consumedCalories: 800,
  consumedProteinG: 60,
  consumedCarbsG: 100,
  consumedFatG: 30,
  goal: 'fat_loss',
  weightKg: 80,
  heightCm: 178,
  age: 25,
  gender: 'male',
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('analyzeFood', () => {
  it('includes userContext in request body when provided', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    await analyzeFood('an apple', undefined, undefined, sampleUserContext);

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [, init] = fetchSpy.mock.calls[0];
    const body = JSON.parse(init?.body as string);

    expect(body.userContext).toEqual(sampleUserContext);
    expect(body.text).toBe('an apple');
  });

  it('omits userContext from request body when not provided', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    await analyzeFood('a banana');

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [, init] = fetchSpy.mock.calls[0];
    const body = JSON.parse(init?.body as string);

    expect(body.userContext).toBeUndefined();
    expect(body.text).toBe('a banana');
  });

  it('sends authorization header with Firebase token', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    await analyzeFood('food');

    const [, init] = fetchSpy.mock.calls[0];
    expect(init?.headers).toEqual(
      expect.objectContaining({ Authorization: 'Bearer mock-id-token' }),
    );
  });

  it('throws on 401 response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 }),
    );

    await expect(analyzeFood('food')).rejects.toThrow('Please sign in');
  });

  it('throws on 429 response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: false, error: 'Rate limited' }), { status: 429 }),
    );

    await expect(analyzeFood('food')).rejects.toThrow('hourly limit');
  });
});
