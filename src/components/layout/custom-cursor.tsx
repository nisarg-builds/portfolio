'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type CursorState = 'default' | 'interactive' | 'text'

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [cursorState, setCursorState] = useState<CursorState>('default')
  const [isTouch, setIsTouch] = useState(true)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 500, damping: 28, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28, mass: 0.5 })

  const trailSpringX = useSpring(mouseX, { stiffness: 200, damping: 35, mass: 0.8 })
  const trailSpringY = useSpring(mouseY, { stiffness: 200, damping: 35, mass: 0.8 })

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    },
    [mouseX, mouseY, isVisible],
  )

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const cursorEl = target.closest('[data-cursor]')
    if (cursorEl) {
      const value = (cursorEl as HTMLElement).dataset.cursor
      if (value === 'text') {
        setCursorState('text')
      } else if (value === 'interactive') {
        setCursorState('interactive')
      } else {
        setCursorState('default')
      }
    } else {
      setCursorState('default')
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false)
  }, [])

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    setIsTouch(isTouchDevice)

    if (isTouchDevice) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    document.body.classList.add('custom-cursor')
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseOver, handleMouseLeave])

  if (isTouch) return null

  return (
    <>
      {/* Trail */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9997]"
        style={{ x: trailSpringX, y: trailSpringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: isVisible ? 0.3 : 0 }}
        transition={{ duration: 0.15 }}
        aria-hidden="true"
      >
        <div className="h-1 w-1 rounded-full bg-accent" />
      </motion.div>

      {/* Main cursor */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] mix-blend-difference"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        aria-hidden="true"
      >
        <motion.div
          className="bg-accent"
          animate={{
            width: cursorState === 'text' ? 2 : cursorState === 'interactive' ? 40 : 8,
            height: cursorState === 'text' ? 24 : cursorState === 'interactive' ? 40 : 8,
            borderRadius: cursorState === 'text' ? 1 : 9999,
            opacity: cursorState === 'interactive' ? 0.5 : 1,
          }}
          style={{
            mixBlendMode: cursorState === 'text' ? 'normal' : 'difference',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </motion.div>
    </>
  )
}
