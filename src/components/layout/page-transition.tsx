'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * A short cross-fade between routes. Deliberately without vertical travel:
 * the page's own content already rises into place, and doing both reads as
 * two competing animations rather than one.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) return <>{children}</>

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
