import { cn } from '@/lib/utils'
import { Star4 } from '@/components/shapes'

interface MarqueeBandProps {
  items: string[]
  className?: string
  /** Seconds per loop */
  speed?: number
  label?: string
}

/**
 * Full-bleed marquee strip: hue surface, 2px ink borders top and bottom,
 * display-font items separated by Star4 sparkles. Pauses on hover; the
 * global reduced-motion rules stop it entirely (the sr-only list always
 * carries the content).
 */
export function MarqueeBand({
  items,
  className,
  speed = 26,
  label = 'Skills',
}: MarqueeBandProps) {
  const row = (ariaHidden: boolean) => (
    <div
      className="flex shrink-0 items-center gap-9 pr-9"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="flex items-center gap-9 font-display text-lg font-bold whitespace-nowrap text-ink"
        >
          {item}
          <Star4 className="h-4 w-4 shrink-0 text-ink" />
        </span>
      ))}
    </div>
  )

  return (
    <div
      className={cn(
        'overflow-hidden border-y-2 border-ink bg-sky py-3.5',
        className,
      )}
    >
      <span className="sr-only">
        {label}: {items.join(', ')}
      </span>
      <div
        className="flex w-max animate-marquee hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
        aria-hidden="true"
      >
        {row(true)}
        {row(true)}
      </div>
    </div>
  )
}
