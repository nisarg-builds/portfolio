'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/** A hairline of accent across the very top, tracking read position. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 40,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-accent"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}
