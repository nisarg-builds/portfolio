'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type CursorState = 'default' | 'interactive' | 'text'

const SIZE: Record<CursorState, { width: number; height: number; radius: number }> = {
  default: { width: 7, height: 7, radius: 999 },
  interactive: { width: 42, height: 42, radius: 999 },
  text: { width: 2, height: 22, radius: 1 },
}

/**
 * A precise dot that opens into a ring over anything clickable.
 *
 * Drawn in white with `mix-blend-mode: difference` so it stays legible over
 * the ink ground, the inverted paper band, and the accent alike — no theme
 * awareness required. Never mounted on coarse pointers or under reduced
 * motion, where a lagging custom cursor is only a cost.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [state, setState] = useState<CursorState>('default')

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const x = useSpring(mouseX, { stiffness: 900, damping: 42, mass: 0.35 })
  const y = useSpring(mouseY, { stiffness: 900, damping: 42, mass: 0.35 })

  const handleMove = useCallback(
    (event: MouseEvent) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
      setVisible(true)
    },
    [mouseX, mouseY],
  )

  const handleOver = useCallback((event: MouseEvent) => {
    const target = (event.target as HTMLElement | null)?.closest?.('[data-cursor]')
    const value = target instanceof HTMLElement ? target.dataset.cursor : undefined
    setState(value === 'text' ? 'text' : value === 'interactive' ? 'interactive' : 'default')
  }, [])

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    function sync() {
      setEnabled(fine.matches && !reduced.matches)
    }

    sync()
    fine.addEventListener('change', sync)
    reduced.addEventListener('change', sync)
    return () => {
      fine.removeEventListener('change', sync)
      reduced.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const hide = () => setVisible(false)

    document.body.classList.add('custom-cursor')
    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseover', handleOver, { passive: true })
    document.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)

    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
    }
  }, [enabled, handleMove, handleOver])

  if (!enabled) return null

  const { width, height, radius } = SIZE[state]

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9998] mix-blend-difference"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          width,
          height,
          borderRadius: radius,
          borderWidth: state === 'interactive' ? 1 : 0,
          backgroundColor:
            state === 'interactive' ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,1)',
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        style={{ borderStyle: 'solid', borderColor: '#fff' }}
      />
    </motion.div>
  )
}
