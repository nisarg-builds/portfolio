'use client'

import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * A printer's device for the end of the page.
 *
 * One continuous stroke — a sprig drawn without lifting the pen — that draws
 * itself in when it scrolls into view. Authored as a path rather than pulled
 * from a clipart library, so it obeys the palette, weighs a few hundred bytes,
 * and is actually a drawing rather than a picture of one.
 */
export function SignatureMark({ className }: { className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <svg
      viewBox="0 0 120 124"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <motion.path
        d="M60 122C60 104 58 92 58 80C44 80 32 71 30 56C45 52 57 63 58 78C58 67 58 59 59 50C75 50 87 41 89 27C74 23 61 34 59 49C59 38 60 28 63 18C57 13 54 7 59 2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        initial={prefersReducedMotion ? undefined : { strokeDasharray: 1, strokeDashoffset: 1 }}
        whileInView={prefersReducedMotion ? undefined : { strokeDashoffset: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 2, ease: [0.33, 0.9, 0.4, 1] }}
      />
    </svg>
  )
}
