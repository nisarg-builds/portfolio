'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useFitGlassStore } from '@/lib/fitglass/hooks/useFitGlassStore';

export function AsyncLoadingBar() {
  const isLoadingToday = useFitGlassStore((s) => s.isLoadingToday);
  const isLoadingWeek = useFitGlassStore((s) => s.isLoadingWeek);
  const isChatLoading = useFitGlassStore((s) => s.isChatLoading);
  const isLoading = isLoadingToday || isLoadingWeek || isChatLoading;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="h-0.5 bg-fg-accent"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
}
