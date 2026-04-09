'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';

export function AsyncLoadingBar() {
  const isLoadingEntries = useNutriStore((s) => s.isLoadingEntries);
  const isChatLoading = useNutriStore((s) => s.isChatLoading);
  const isLoading = isLoadingEntries || isChatLoading;

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
