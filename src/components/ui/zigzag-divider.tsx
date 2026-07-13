'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings } from '@/lib/easings'
import { usePrefersReducedMotion } from '@/lib/hooks'

interface ZigzagDividerProps {
  className?: string
  /** Max width in px (defaults to 200, like the old WavyDivider) */
  width?: number
}

/**
 * Ric-rac ribbon divider — replaces WavyDivider. Stroke color comes from
 * `currentColor`, so set it with a text-* class (defaults to ink).
 */
export function ZigzagDivider({ className, width = 200 }: ZigzagDividerProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <svg
      viewBox="0 0 96 28"
      preserveAspectRatio="none"
      className={cn('block h-[14px] w-full text-ink', className)}
      style={{ maxWidth: width }}
      aria-hidden="true"
    >
      <motion.path
        d="M0 24 L16 4 L32 24 L48 4 L64 24 L80 4 L96 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.2, ease: easings.easeOut }}
      />
    </svg>
  )
}
