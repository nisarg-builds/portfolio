'use client';

import { useEffect, useState, useCallback } from 'react';
import { getDoc } from 'firebase/firestore';
import { getUserProfileRef } from '../services/firebase-client';
import { useFitGlassStore } from './useFitGlassStore';
import { useAuth } from './useAuth';
import { validateProfile } from '../utils/validators';
import type { UserProfile } from '../models';

const DEFAULT_PROFILE: Omit<UserProfile, 'userId' | 'displayName' | 'email' | 'createdAt' | 'updatedAt'> = {
  weightKg: 70,
  heightCm: 170,
  age: 25,
  gender: 'male',
  goal: 'maintenance',
  activityLevelId: 'moderate',
  goalRateKgPerWeek: 0.5,
  preferredUnits: 'metric',
};

export function useProfile() {
  const { user } = useAuth();
  const profile = useFitGlassStore((s) => s.profile);
  const targets = useFitGlassStore((s) => s.targets);
  const setProfile = useFitGlassStore((s) => s.setProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Load profile on mount when user is authenticated
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        const ref = getUserProfileRef(user!.uid);
        const snap = await getDoc(ref);

        if (cancelled) return;

        if (snap.exists()) {
          const data = snap.data();
          const loaded: UserProfile = {
            ...data,
            userId: user!.uid,
            createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
          } as UserProfile;
          setProfile(loaded);
          setNeedsOnboarding(false);
        } else {
          // No profile exists — user needs onboarding
          setNeedsOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user, setProfile]);

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      if (!profile) return { valid: false, errors: ['No profile loaded'] };

      const merged = { ...profile, ...updates };
      const result = validateProfile(merged);
      if (!result.valid) return result;

      setProfile(merged);
      return result;
    },
    [profile, setProfile],
  );

  const completeOnboarding = useCallback(() => {
    setNeedsOnboarding(false);
  }, []);

  return { profile, targets, updateProfile, isLoading, needsOnboarding, completeOnboarding };
}
