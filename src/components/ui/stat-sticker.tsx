import { cn } from '@/lib/utils'

interface StatStickerProps {
  value: string
  label: string
  className?: string
  /** Surface hue class, e.g. 'bg-lilac' */
  hueClassName?: string
}

/**
 * BoltTile-framed stat: rounded tile with corner dots, ink numeral,
 * mono label. Used for the Experience stats row.
 */
export function StatSticker({
  value,
  label,
  className,
  hueClassName = 'bg-lilac',
}: StatStickerProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border-2 border-ink px-4 py-3 text-center',
        hueClassName,
        className,
      )}
    >
      <span
        className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-ink/70"
        aria-hidden="true"
      />
      <span
        className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-ink/70"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-ink/70"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-ink/70"
        aria-hidden="true"
      />
      <span className="block font-display text-xl font-bold text-ink [font-variant-numeric:tabular-nums]">
        {value}
      </span>
      <span className="mt-0.5 block font-mono text-[10px] tracking-wider text-ink/70 uppercase">
        {label}
      </span>
    </div>
  )
}
