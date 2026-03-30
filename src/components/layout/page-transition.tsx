'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { usePrefersReducedMotion } from '@/lib/hooks'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
}

const instantVariants = {
  initial: { opacity: 1, y: 0 },
  enter: { opacity: 1, y: 0, transition: { duration: 0 } },
  exit: { opacity: 1, y: 0, transition: { duration: 0 } },
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
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
