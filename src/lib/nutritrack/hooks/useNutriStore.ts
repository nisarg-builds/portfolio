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
import { db, getUserProfileRef, getFoodLogCollection } from '../services/firebase-client';
import type { UserProfile, ComputedTargets, FoodEntry, QuickFood, ChatMessage } from '../models';
import { computeAllTargets } from '../utils/calculations';
import { getActivityLevel } from '../constants/activityLevels';
import { getDateKey, getLastNDays } from '../utils/dates';

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
  isLoadingEntries: boolean;

  // Quick Foods
  quickFoods: QuickFood[];

  // Chat
  chatMessages: ChatMessage[];
  isChatLoading: boolean;

  // Active View
  activeView: 'today' | 'chat' | 'week' | 'insights' | 'profile';

  // Actions
  setUser: (user: NutriState['user']) => void;
  setProfile: (profile: UserProfile) => void;
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  removeFoodEntry: (entryId: string) => Promise<void>;
  addChatMessage: (message: ChatMessage) => void;
  analyzeFood: (text?: string, imageBase64?: string, mediaType?: string) => Promise<void>;
  setActiveView: (view: NutriState['activeView']) => void;
  loadTodayEntries: () => Promise<void>;
  loadWeekEntries: () => Promise<void>;
}

// ─── Helpers ───

let profileDebounceTimer: ReturnType<typeof setTimeout> | null = null;

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

export const useNutriStore = create<NutriState>((set, get) => ({
  // Initial state
  user: null,
  authLoading: true,
  profile: null,
  targets: null,
  todayEntries: [],
  weekEntries: {},
  isLoadingEntries: false,
  quickFoods: [],
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

    // Optimistic add
    if (entry.dateKey === today) {
      set((state) => ({ todayEntries: [fullEntry, ...state.todayEntries] }));
    }

    try {
      // Strip `id` — Firestore auto-generates the document ID
      const { id: _, ...firestoreData } = fullEntry;
      const docRef = await addDoc(getFoodLogCollection(entry.userId), firestoreData);

      // Replace temp ID with real Firestore ID
      set((state) => ({
        todayEntries: state.todayEntries.map((e) =>
          e.id === tempId ? { ...e, id: docRef.id } : e,
        ),
      }));
    } catch (error) {
      console.error('Failed to add food entry:', error);
      // Roll back optimistic update
      set((state) => ({
        todayEntries: state.todayEntries.filter((e) => e.id !== tempId),
      }));
    }
  },

  removeFoodEntry: async (entryId) => {
    const { todayEntries, user } = get();
    const removed = todayEntries.find((e) => e.id === entryId);
    if (!removed || !user) return;

    // Optimistic remove
    set((state) => ({
      todayEntries: state.todayEntries.filter((e) => e.id !== entryId),
    }));

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'foodLog', entryId));
    } catch (error) {
      console.error('Failed to remove food entry:', error);
      // Roll back — restore the removed entry
      set((state) => ({
        todayEntries: [...state.todayEntries, removed].sort(
          (a, b) => b.loggedAt.getTime() - a.loggedAt.getTime(),
        ),
      }));
    }
  },

  loadTodayEntries: async () => {
    const uid = get().user?.uid;
    if (!uid) return;

    set({ isLoadingEntries: true });
    try {
      const q = query(
        getFoodLogCollection(uid),
        where('dateKey', '==', getDateKey()),
        orderBy('loggedAt', 'desc'),
      );
      const snap = await getDocs(q);
      const entries = snap.docs.map(docToFoodEntry);
      set({ todayEntries: entries, isLoadingEntries: false });
    } catch (error) {
      console.error('Failed to load today entries:', error);
      set({ isLoadingEntries: false });
    }
  },

  loadWeekEntries: async () => {
    const uid = get().user?.uid;
    if (!uid) return;

    set({ isLoadingEntries: true });
    try {
      const days = getLastNDays(7);
      const q = query(getFoodLogCollection(uid), where('dateKey', 'in', days));
      const snap = await getDocs(q);

      const grouped: Record<string, FoodEntry[]> = {};
      for (const d of snap.docs) {
        const entry = docToFoodEntry(d);
        if (!grouped[entry.dateKey]) grouped[entry.dateKey] = [];
        grouped[entry.dateKey].push(entry);
      }

      set({ weekEntries: grouped, isLoadingEntries: false });
    } catch (error) {
      console.error('Failed to load week entries:', error);
      set({ isLoadingEntries: false });
    }
  },

  setActiveView: (view) => {
    set({ activeView: view });
  },

  addChatMessage: (message) => {
    set((state) => ({ chatMessages: [...state.chatMessages, message] }));
  },

  analyzeFood: async () => {
    console.log('AI not connected yet');
  },
}));
