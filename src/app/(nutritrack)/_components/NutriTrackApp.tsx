'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/nutritrack/hooks/useAuth';
import { useProfile } from '@/lib/nutritrack/hooks/useProfile';
import { useFoodLog } from '@/lib/nutritrack/hooks/useFoodLog';

// ─── Loading Spinner ───

function LoadingScreen() {
  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-nt-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-10 w-10 rounded-full border-3 border-nt-border border-t-nt-accent"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}

// ─── Sign-In Screen ───

function SignInScreen({ onSignIn }: { onSignIn: () => Promise<void> }) {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-nt-bg px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-nt-text">NutriTrack</h1>
        <p className="mt-2 text-nt-text-soft">AI-powered calorie tracking</p>
      </div>

      <motion.button
        onClick={onSignIn}
        className="rounded-xl bg-nt-accent px-8 py-3 font-semibold text-white shadow-md"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
      >
        Sign in with Google
      </motion.button>
    </motion.div>
  );
}

// ─── Authenticated App Shell ───

function AuthenticatedApp() {
  const { profile, isLoading: profileLoading } = useProfile();
  useFoodLog();

  if (profileLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-nt-bg px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-xl font-semibold text-nt-text">
        Welcome, {profile?.displayName || 'there'}
      </p>
    </motion.div>
  );
}

// ─── Root Component ───

export function NutriTrackApp() {
  const { user, loading, signInWithGoogle } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loading" />
      ) : !user ? (
        <SignInScreen key="signin" onSignIn={signInWithGoogle} />
      ) : (
        <AuthenticatedApp key="app" />
      )}
    </AnimatePresence>
  );
}
