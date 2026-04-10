'use client';

import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { useAuth } from '@/lib/fitglass/hooks/useAuth';
import { useProfile } from '@/lib/fitglass/hooks/useProfile';
import { useFoodLog } from '@/lib/fitglass/hooks/useFoodLog';
import { AppShell } from './layout/AppShell';

// ─── Loading Spinner ───

function LoadingScreen() {
  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-fg-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-10 w-10 rounded-full border-3 border-fg-border border-t-fg-accent"
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
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-fg-bg px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-fg-text">FitGlass</h1>
        <p className="mt-2 text-fg-text-soft">AI-powered calorie tracking</p>
      </div>

      <motion.button
        onClick={onSignIn}
        className="rounded-xl bg-fg-accent px-8 py-3 font-semibold text-white shadow-md"
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
  const { isLoading: profileLoading } = useProfile();
  useFoodLog();

  if (profileLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AppShell />
    </motion.div>
  );
}

// ─── Root Component ───

export function FitGlassApp() {
  const { user, loading, signInWithGoogle } = useAuth();

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" />
        ) : !user ? (
          <SignInScreen key="signin" onSignIn={signInWithGoogle} />
        ) : (
          <AuthenticatedApp key="app" />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
