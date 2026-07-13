import { cn } from '@/lib/utils'

interface LoopsProps {
  className?: string
}

/**
 * Concentric rounded-rect loops. Outer ring in `currentColor`,
 * inner ring via the `--loops-inner` custom property, e.g.
 * `className="text-punch [--loops-inner:var(--color-tangerine)]"`.
 */
export function Loops({ className }: LoopsProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn(className)} aria-hidden="true">
      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="11"
      />
      <rect
        x="30"
        y="30"
        width="40"
        height="40"
        rx="13"
        fill="none"
        stroke="var(--loops-inner, currentColor)"
        strokeWidth="11"
      />
    </svg>
  )
}
