'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
  doc,
  collection,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Lazy singletons — Firebase only initializes when first accessed at runtime,
// avoiding errors during Next.js static prerendering where env vars may be absent.
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!_app) {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getFirebaseApp());
  }
  return _auth;
}

export const googleProvider = new GoogleAuthProvider();

export function getFirebaseDb(): Firestore {
  if (!_db) {
    const app = getFirebaseApp();
    try {
      _db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch {
      _db = getFirestore(app);
    }
  }
  return _db;
}

// ─── Collection helpers ───

export function getUserProfileRef(uid: string) {
  return doc(getFirebaseDb(), 'users', uid, 'profile', 'main');
}

export function getFoodLogCollection(uid: string) {
  return collection(getFirebaseDb(), 'users', uid, 'foodLog');
}

export function getQuickFoodsCollection(uid: string) {
  return collection(getFirebaseDb(), 'users', uid, 'quickFoods');
}
