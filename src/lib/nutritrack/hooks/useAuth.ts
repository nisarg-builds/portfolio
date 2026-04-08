'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { getFirebaseAuth, googleProvider } from '../services/firebase-client';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(getFirebaseAuth(), googleProvider);
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      if (code === 'auth/popup-blocked') {
        await signInWithRedirect(getFirebaseAuth(), googleProvider);
        return;
      }
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(getFirebaseAuth());
  }, []);

  return { user, loading, signInWithGoogle, signOut };
}
