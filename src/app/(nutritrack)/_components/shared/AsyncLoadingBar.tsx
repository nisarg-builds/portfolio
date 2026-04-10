'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';

export function AsyncLoadingBar() {
  const isLoadingToday = useNutriStore((s) => s.isLoadingToday);
  const isLoadingWeek = useNutriStore((s) => s.isLoadingWeek);
  const isChatLoading = useNutriStore((s) => s.isChatLoading);
  const isLoading = isLoadingToday || isLoadingWeek || isChatLoading;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="h-0.5 bg-nt-accent"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
}
