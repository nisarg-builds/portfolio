'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type CursorState = 'default' | 'interactive' | 'text'

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [cursorState, setCursorState] = useState<CursorState>('default')
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
  )

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

  const handleMouseDown = useCallback(() => setIsPressed(true), [])
  const handleMouseUp = useCallback(() => setIsPressed(false), [])

  useEffect(() => {
    if (isTouch) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    document.body.classList.add('custom-cursor')
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isTouch, handleMouseMove, handleMouseOver, handleMouseDown, handleMouseUp, handleMouseLeave])

  if (isTouch) return null

  return (
    <>
      {/* Trail */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9997]"
        style={{ x: trailSpringX, y: trailSpringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: isVisible ? 0.5 : 0 }}
        transition={{ duration: 0.15 }}
        aria-hidden="true"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-lilac" />
      </motion.div>

      {/* Main cursor: ink dot → lime disc over interactives → I-beam over text.
          Squeezes while the mouse button is down. */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        aria-hidden="true"
      >
        <motion.div
          className="border-ink"
          style={{ borderStyle: 'solid' }}
          animate={{
            width: cursorState === 'text' ? 2 : cursorState === 'interactive' ? 44 : 10,
            height: cursorState === 'text' ? 24 : cursorState === 'interactive' ? 44 : 10,
            borderRadius: cursorState === 'text' ? 1 : 9999,
            borderWidth: cursorState === 'interactive' ? 2 : 0,
            backgroundColor:
              cursorState === 'interactive' ? 'rgba(221, 241, 99, 0.55)' : '#101010',
            scale: isPressed ? 0.8 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </motion.div>
    </>
  )
}
