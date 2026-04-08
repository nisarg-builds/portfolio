import 'server-only'
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

export const hasFirebaseCredentials = !!(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
)

function getApp(): App {
  if (getApps().length > 0) return getApps()[0]

  if (!hasFirebaseCredentials) {
    throw new Error(
      'Firebase credentials not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
    )
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  })
}

export function getAdminAuth() {
  return getAuth(getApp())
}

export function getAdminDb() {
  return getFirestore(getApp())
}

export function getAdminBucket() {
  return getStorage(getApp()).bucket()
}

// Lazy getters — only initialize Firebase when actually accessed at runtime
export const adminDb = new Proxy({} as FirebaseFirestore.Firestore, {
  get(_, prop) {
    return (getAdminDb() as never)[prop]
  },
})

export const adminBucket = new Proxy(
  {} as ReturnType<ReturnType<typeof getStorage>['bucket']>,
  {
    get(_, prop) {
      return (getAdminBucket() as never)[prop]
    },
  },
)
