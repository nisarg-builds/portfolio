'use client';

import { create } from 'zustand';
import {
  setDoc,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getFirebaseDb, getUserProfileRef, getFoodLogCollection } from '../services/firebase-client';
import type { UserProfile, ComputedTargets, FoodEntry, ChatMessage } from '../models';
import { computeAllTargets } from '../utils/calculations';
import { getActivityLevel } from '../constants/activityLevels';
import { getDateKey, getLastNDays } from '../utils/dates';
import { analyzeFood as analyzeFoodService } from '../services/ai';
import { computeMacroTotals } from './useTodayMacros';
import type { UserContext } from '../models/chat';

// ─── Types ───

interface NutriState {
  // Auth
  user: { uid: string; email: string; displayName: string } | null;
  authLoading: boolean;

  // Profile
  profile: UserProfile | null;
  targets: ComputedTargets | null;

  // Food Log
  todayEntries: FoodEntry[];
  weekEntries: Record<string, FoodEntry[]>;
  isLoadingToday: boolean;
  isLoadingWeek: boolean;

  // Chat
  chatMessages: ChatMessage[];
  isChatLoading: boolean;

  // Active View
  activeView: 'today' | 'chat' | 'week' | 'profile';

  // Actions
  setUser: (user: NutriState['user']) => void;
  setProfile: (profile: UserProfile) => void;
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  removeFoodEntry: (entryId: string) => Promise<void>;
  addChatMessage: (message: ChatMessage) => void;
  analyzeFood: (text?: string, imageBase64?: string, mediaType?: string) => Promise<void>;
  setActiveView: (view: NutriState['activeView']) => void;
  loadTodayEntries: () => Promise<void>;
  loadWeekEntries: (offset?: number) => Promise<void>;
  resetAllData: () => Promise<void>;
}

export type ActiveView = NutriState['activeView'];

// ─── Helpers ───

let profileDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let _weekRequestId = 0;

function docToFoodEntry(snapshot: QueryDocumentSnapshot): FoodEntry {
  const data = snapshot.data();
  return {
    ...data,
    id: snapshot.id,
    loggedAt: data.loggedAt?.toDate?.() ?? new Date(data.loggedAt),
    createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
  } as FoodEntry;
}

// ─── Store ───

export const useFitGlassStore = create<NutriState>((set, get) => ({
  // Initial state
  user: null,
  authLoading: true,
  profile: null,
  targets: null,
  todayEntries: [],
  weekEntries: {},
  isLoadingToday: false,
  isLoadingWeek: false,
  chatMessages: [],
  isChatLoading: false,
  activeView: 'today',

  // ─── Actions ───

  setUser: (user) => {
    set({ user, authLoading: false });
  },

  setProfile: (profile) => {
    const activity = getActivityLevel(profile.activityLevelId);
    const targets = computeAllTargets({
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      age: profile.age,
      gender: profile.gender,
      activityMultiplier: activity.multiplier,
      goal: profile.goal,
      goalRateKgPerWeek: profile.goalRateKgPerWeek,
    });

    set({ profile, targets });

    // Debounced Firestore write
    if (profileDebounceTimer) clearTimeout(profileDebounceTimer);
    profileDebounceTimer = setTimeout(async () => {
      try {
        await setDoc(
          getUserProfileRef(profile.userId),
          { ...profile, updatedAt: new Date() },
          { merge: true },
        );
      } catch (error) {
        console.error('Failed to save profile to Firestore:', error);
      }
    }, 500);
  },

  addFoodEntry: async (entry) => {
    const tempId = `temp-${Date.now()}`;
    const now = new Date();
    const fullEntry: FoodEntry = { ...entry, id: tempId, createdAt: now, updatedAt: now };
    const today = getDateKey();

    // Optimistic add to todayEntries and weekEntries
    if (entry.dateKey === today) {
      set((state) => ({
        todayEntries: [fullEntry, ...state.todayEntries],
        weekEntries: state.weekEntries[today]
          ? { ...state.weekEntries, [today]: [fullEntry, ...state.weekEntries[today]] }
          : state.weekEntries,
      }));
    }

    try {
      // Strip `id` — Firestore auto-generates the document ID
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, ...firestoreData } = fullEntry;
      const docRef = await addDoc(getFoodLogCollection(entry.userId), firestoreData);

      // Replace temp ID with real Firestore ID in both slices
      set((state) => ({
        todayEntries: state.todayEntries.map((e) =>
          e.id === tempId ? { ...e, id: docRef.id } : e,
        ),
        weekEntries: state.weekEntries[today]
          ? {
              ...state.weekEntries,
              [today]: state.weekEntries[today].map((e) =>
                e.id === tempId ? { ...e, id: docRef.id } : e,
              ),
            }
          : state.weekEntries,
      }));
    } catch (error) {
      console.error('Failed to add food entry:', error);
      // Roll back optimistic update from both slices
      set((state) => ({
        todayEntries: state.todayEntries.filter((e) => e.id !== tempId),
        weekEntries: state.weekEntries[today]
          ? {
              ...state.weekEntries,
              [today]: state.weekEntries[today].filter((e) => e.id !== tempId),
            }
          : state.weekEntries,
      }));
    }
  },

  removeFoodEntry: async (entryId) => {
    const { todayEntries, user } = get();
    const removed = todayEntries.find((e) => e.id === entryId);
    if (!removed || !user) return;

    const today = getDateKey();

    // Optimistic remove from todayEntries and weekEntries
    set((state) => ({
      todayEntries: state.todayEntries.filter((e) => e.id !== entryId),
      weekEntries: state.weekEntries[today]
        ? {
            ...state.weekEntries,
            [today]: state.weekEntries[today].filter((e) => e.id !== entryId),
          }
        : state.weekEntries,
    }));

    try {
      await deleteDoc(doc(getFirebaseDb(), 'users', user.uid, 'foodLog', entryId));
    } catch (error) {
      console.error('Failed to remove food entry:', error);
      // Roll back — restore the removed entry in both slices
      set((state) => ({
        todayEntries: [...state.todayEntries, removed].sort(
          (a, b) => b.loggedAt.getTime() - a.loggedAt.getTime(),
        ),
        weekEntries: state.weekEntries[today]
          ? {
              ...state.weekEntries,
              [today]: [...(state.weekEntries[today] || []), removed].sort(
                (a, b) => b.loggedAt.getTime() - a.loggedAt.getTime(),
              ),
            }
          : state.weekEntries,
      }));
    }
  },

  loadTodayEntries: async () => {
    const uid = get().user?.uid;
    if (!uid) return;

    set({ isLoadingToday: true });
    try {
      const q = query(
        getFoodLogCollection(uid),
        where('dateKey', '==', getDateKey()),
        orderBy('loggedAt', 'desc'),
      );
      const snap = await getDocs(q);
      const entries = snap.docs.map(docToFoodEntry);
      set({ todayEntries: entries, isLoadingToday: false });
    } catch (error) {
      console.error('Failed to load today entries:', error);
      set({ isLoadingToday: false });
    }
  },

  loadWeekEntries: async (offset = 0) => {
    const uid = get().user?.uid;
    if (!uid) return;

    const requestId = ++_weekRequestId;
    set({ isLoadingWeek: true });
    try {
      const days = getLastNDays(7, offset);
      const q = query(getFoodLogCollection(uid), where('dateKey', 'in', days));
      const snap = await getDocs(q);

      // Drop stale responses from earlier requests
      if (requestId !== _weekRequestId) return;

      const grouped: Record<string, FoodEntry[]> = {};
      for (const d of snap.docs) {
        const entry = docToFoodEntry(d);
        if (!grouped[entry.dateKey]) grouped[entry.dateKey] = [];
        grouped[entry.dateKey].push(entry);
      }

      set({ weekEntries: grouped, isLoadingWeek: false });
    } catch (error) {
      if (requestId !== _weekRequestId) return;
      console.error('Failed to load week entries:', error);
      set({ isLoadingWeek: false });
    }
  },

  setActiveView: (view) => {
    set({ activeView: view });
  },

  addChatMessage: (message) => {
    set((state) => ({ chatMessages: [...state.chatMessages, message] }));
  },

  analyzeFood: async (text, imageBase64, mediaType) => {
    const assistantId = `msg-${Date.now()}-assistant`;

    // Add loading assistant message
    set((state) => ({
      isChatLoading: true,
      chatMessages: [
        ...state.chatMessages,
        {
          id: assistantId,
          role: 'assistant' as const,
          text: 'Analyzing your food...',
          timestamp: new Date(),
          isLoading: true,
        },
      ],
    }));

    try {
      // Build userContext from current store state (profile + targets + today's totals)
      let userContext: UserContext | undefined;
      const { profile, targets, todayEntries } = get();
      if (profile && targets) {
        const totals = computeMacroTotals(todayEntries);
        userContext = {
          dailyCalorieTarget: targets.dailyCalorieTarget,
          proteinTargetG: targets.proteinTargetG,
          fatMinG: targets.fatMinG,
          carbsRemainingG: targets.carbsRemainingG,
          consumedCalories: totals.consumed,
          consumedProteinG: totals.proteinG,
          consumedCarbsG: totals.carbsG,
          consumedFatG: totals.fatG,
          goal: profile.goal,
          weightKg: profile.weightKg,
          heightCm: profile.heightCm,
          age: profile.age,
          gender: profile.gender,
        };
      }

      const response = await analyzeFoodService(
        text,
        imageBase64,
        mediaType as 'image/jpeg' | 'image/png' | 'image/webp' | undefined,
        userContext,
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Analysis failed');
      }

      // Replace loading message with real response
      set((state) => ({
        isChatLoading: false,
        chatMessages: state.chatMessages.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                text: response.data!.message,
                foods: response.data!.foods,
                isLoading: false,
              }
            : msg,
        ),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Something went wrong. Please try again.';

      // Replace loading message with error
      set((state) => ({
        isChatLoading: false,
        chatMessages: state.chatMessages.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                text: errorMessage,
                isLoading: false,
                isError: true,
              }
            : msg,
        ),
      }));
    }
  },

  resetAllData: async () => {
    const { user } = get();
    if (!user) return;

    try {
      // Delete all food log entries
      const q = query(getFoodLogCollection(user.uid));
      const snap = await getDocs(q);
      const deletes = snap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletes);

      // Reset profile to defaults
      const now = new Date();
      const defaultProfile: UserProfile = {
        userId: user.uid,
        displayName: user.displayName,
        email: user.email,
        weightKg: 70,
        heightCm: 170,
        age: 25,
        gender: 'male',
        goal: 'maintenance',
        activityLevelId: 'moderate',
        goalRateKgPerWeek: 0.5,
        preferredUnits: 'metric',
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(getUserProfileRef(user.uid), defaultProfile);

      // Reset local state
      const activity = getActivityLevel(defaultProfile.activityLevelId);
      const targets = computeAllTargets({
        weightKg: defaultProfile.weightKg,
        heightCm: defaultProfile.heightCm,
        age: defaultProfile.age,
        gender: defaultProfile.gender,
        activityMultiplier: activity.multiplier,
        goal: defaultProfile.goal,
        goalRateKgPerWeek: defaultProfile.goalRateKgPerWeek,
      });

      set({
        profile: defaultProfile,
        targets,
        todayEntries: [],
        weekEntries: {},
        chatMessages: [],
      });
    } catch (error) {
      console.error('Failed to reset all data:', error);
    }
  },
}));
