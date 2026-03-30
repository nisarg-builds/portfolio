'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FloatingElementProps {
  children: React.ReactNode
  drift?: number
  duration?: number
  rotate?: number
  className?: string
}

export function FloatingElement({
  children,
  drift = 20,
  duration = 6,
  rotate = 5,
  className,
}: FloatingElementProps) {
  return (
    <motion.div
      className={cn('pointer-events-none select-none', className)}
      aria-hidden="true"
      animate={{
        y: [0, -drift, 0, drift * 0.5, 0],
        x: [0, drift * 0.3, 0, -drift * 0.3, 0],
        rotate: [0, rotate, 0, -rotate * 0.5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}
