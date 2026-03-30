'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/hooks'

interface MagneticButtonProps {
  children: React.ReactNode
  href?: string
  className?: string
  magnetic?: boolean
}

export function MagneticButton({ children, href, className, magnetic = true }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.2 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.2 })

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current || !magnetic || prefersReduced) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    x.set(distX * 0.15)
    y.set(distY * 0.15)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const Tag = href ? 'a' : 'span'
  const linkProps = href
    ? {
        href,
        ...(href.startsWith('mailto:') || href.startsWith('#')
          ? {}
          : { target: '_blank' as const, rel: 'noopener noreferrer' }),
      }
    : {}

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      <Tag
        {...linkProps}
        className={className}
        data-cursor="interactive"
      >
        {children}
      </Tag>
    </motion.div>
  )
}
