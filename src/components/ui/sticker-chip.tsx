import { cn } from '@/lib/utils'

type StickerHue = 'lilac' | 'lime' | 'sky' | 'paper' | 'grass' | 'tangerine'

interface StickerChipProps {
  children: React.ReactNode
  className?: string
  /** Explicit surface hue */
  hue?: StickerHue
  /** Rotates through lilac/lime/sky/paper when no hue is given */
  index?: number
}

const HUE_CLASSES: Record<StickerHue, string> = {
  lilac: 'bg-lilac',
  lime: 'bg-lime',
  sky: 'bg-sky',
  paper: 'bg-paper',
  grass: 'bg-grass',
  tangerine: 'bg-tangerine',
}

const ROTATION: StickerHue[] = ['lilac', 'lime', 'sky', 'paper']

export function StickerChip({ children, className, hue, index }: StickerChipProps) {
  const resolved = hue ?? ROTATION[(index ?? 3) % ROTATION.length]

  return (
    <span
      className={cn(
        'inline-block rounded-full border-[1.5px] border-ink px-3 py-1 font-mono text-xs font-semibold text-ink',
        'transition-transform duration-200 hover:-rotate-3',
        HUE_CLASSES[resolved],
        className,
      )}
    >
      {children}
    </span>
  )
}
