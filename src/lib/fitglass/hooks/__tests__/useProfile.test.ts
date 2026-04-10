import { describe, it, expect } from 'vitest';

/**
 * Tests for the needsOnboarding logic used in useProfile.
 *
 * The hook determines onboarding status based on whether a Firestore document
 * exists for the user. We extract and test this decision logic as a pure function.
 */

interface SnapshotLike {
  exists: () => boolean;
}

/**
 * Mirrors the decision logic inside useProfile's loadProfile:
 * - If the snapshot exists → profile was found, no onboarding needed.
 * - If the snapshot does not exist → user is new, onboarding required.
 */
function resolveNeedsOnboarding(snap: SnapshotLike | null): boolean {
  if (!snap) return false; // no user / error — don't trigger onboarding
  return !snap.exists();
}

describe('needsOnboarding logic', () => {
  it('returns false when a Firestore profile document exists', () => {
    const snap: SnapshotLike = { exists: () => true };
    expect(resolveNeedsOnboarding(snap)).toBe(false);
  });

  it('returns true when no Firestore profile document exists', () => {
    const snap: SnapshotLike = { exists: () => false };
    expect(resolveNeedsOnboarding(snap)).toBe(true);
  });

  it('returns false when snap is null (no user or error state)', () => {
    expect(resolveNeedsOnboarding(null)).toBe(false);
  });
});
