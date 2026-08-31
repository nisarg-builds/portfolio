import { cn } from '@/lib/utils'

interface SectionMarkerProps {
  /** Two-digit section number, e.g. "02". Sets the editorial rhythm. */
  number: string
  label: string
  /** Optional right-hand annotation — a count, a year range, a status. */
  annotation?: string
  /**
   * Render the label as the section's heading. Use this when the marker is
   * the only title the section has; sections that carry their own display
   * headline should leave it as a paragraph so the outline stays flat.
   */
  as?: 'p' | 'h2'
  className?: string
}

/**
 * The section header used throughout the site: a hairline rule with a
 * numbered caption hanging beneath it, the way a printed catalogue marks its
 * chapters. Structure is the ornament here — no icons, no gradients.
 *
 * The numeral and divider are hidden from assistive tech so the accessible
 * name is just the label ("About"), not "01 slash About".
 */
export function SectionMarker({
  number,
  label,
  annotation,
  as: Label = 'p',
  className,
}: SectionMarkerProps) {
  return (
    <div className={cn('rule flex items-baseline justify-between gap-4 pt-3', className)}>
      <Label className="meta font-normal text-text-tertiary">
        <span className="numeral text-accent" aria-hidden="true">
          {number}
        </span>
        <span className="px-2 opacity-40" aria-hidden="true">
          /
        </span>
        {label}
      </Label>
      {annotation && (
        <p className="meta numeral text-text-tertiary">{annotation}</p>
      )}
    </div>
  )
}
