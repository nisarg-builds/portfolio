'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`Step ${currentStep + 1} of ${totalSteps}`}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <motion.div
          key={i}
          className={cn(
            'h-2 rounded-full transition-colors',
            i === currentStep ? 'bg-fg-accent' : i < currentStep ? 'bg-fg-accent/50' : 'bg-fg-border',
          )}
          animate={{ width: i === currentStep ? 24 : 8 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
