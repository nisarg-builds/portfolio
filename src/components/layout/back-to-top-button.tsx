'use client'

import { usePrefersReducedMotion } from '@/lib/hooks'
import { ArrowBolt } from '@/components/shapes'

export function BackToTopButton() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <button
      onClick={() =>
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      }
      aria-label="Back to top"
      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-lime text-ink transition-transform duration-200 hover:-translate-y-1 hover:rotate-6"
      data-cursor="interactive"
    >
      <ArrowBolt direction="up" className="h-4 w-4" />
    </button>
  )
}
