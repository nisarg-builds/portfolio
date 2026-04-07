'use client'

import { useSyncExternalStore } from 'react'

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      mq.addEventListener('change', callback)
      return () => mq.removeEventListener('change', callback)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}

export function useIsTouchDevice(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => window.matchMedia('(pointer: coarse)').matches,
    () => false,
  )
}
