'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { usePrefersReducedMotion } from '@/lib/hooks'
import { easings } from '@/lib/easings'

/* Entrance-only by design: App Router swaps the tree on navigation, so exit
   animations can't run without freezing router context (fragile internal
   API). Keying on pathname re-triggers the entrance per route. */
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easings.easeOut,
      delay: 0.1,
    },
  },
}

const instantVariants = {
  initial: { opacity: 1, y: 0 },
  enter: { opacity: 1, y: 0, transition: { duration: 0 } },
}

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      key={pathname}
      variants={prefersReducedMotion ? instantVariants : pageVariants}
      initial="initial"
      animate="enter"
    >
      {children}
    </motion.div>
  )
}
