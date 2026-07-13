import { useId } from 'react'
import { cn } from '@/lib/utils'

interface BloomProps {
  className?: string
  /** Star-shaped hole in the center (true cutout — the page shows through) */
  cutout?: boolean
}

export function Bloom({ className, cutout = true }: BloomProps) {
  const maskId = useId()

  return (
    <svg viewBox="0 0 100 100" className={cn(className)} aria-hidden="true">
      {cutout && (
        <defs>
          <mask id={maskId}>
            <rect width="100" height="100" fill="white" />
            <path
              d="M50 34 L55 45 L66 50 L55 55 L50 66 L45 55 L34 50 L45 45 Z"
              fill="black"
            />
          </mask>
        </defs>
      )}
      <g fill="currentColor" mask={cutout ? `url(#${maskId})` : undefined}>
        <circle cx="50" cy="26" r="24" />
        <circle cx="74" cy="50" r="24" />
        <circle cx="50" cy="74" r="24" />
        <circle cx="26" cy="50" r="24" />
      </g>
    </svg>
  )
}
