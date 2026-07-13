import { cn } from '@/lib/utils'

interface BoltTileProps {
  className?: string
}

/**
 * Rounded tile in `currentColor` with four corner dots.
 * Dot hue via the `--bolt-dot` custom property, e.g.
 * `className="text-grass [--bolt-dot:var(--color-grape)]"`.
 */
export function BoltTile({ className }: BoltTileProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn(className)} aria-hidden="true">
      <rect x="4" y="4" width="92" height="92" rx="20" fill="currentColor" />
      <g fill="var(--bolt-dot, var(--color-grape))">
        <circle cx="20" cy="20" r="7" />
        <circle cx="80" cy="20" r="7" />
        <circle cx="20" cy="80" r="7" />
        <circle cx="80" cy="80" r="7" />
      </g>
    </svg>
  )
}
