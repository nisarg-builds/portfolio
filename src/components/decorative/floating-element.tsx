'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/hooks'

interface FloatingElementProps {
  children: React.ReactNode
  drift?: number
  duration?: number
  rotate?: number
  delay?: number
  className?: string
}

export function FloatingElement({
  children,
  drift = 20,
  duration = 6,
  rotate = 5,
  delay = 0,
  className,
}: FloatingElementProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div className={cn('pointer-events-none select-none', className)} aria-hidden="true">
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={cn('pointer-events-none select-none', className)}
      aria-hidden="true"
      animate={{
        y: [0, -drift, drift * 0.3, -drift * 0.7, 0],
        x: [0, drift * 0.5, -drift * 0.2, drift * 0.1, 0],
        rotate: [0, rotate, -rotate * 0.3, rotate * 0.6, 0],
      }}
      transition={{
        y: {
          duration,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay,
        },
        x: {
          duration: duration * 1.3,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay,
        },
        rotate: {
          duration: duration * 0.9,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay,
        },
      }}
    >
      {children}
    </motion.div>
  )
}
