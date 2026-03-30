'use client'

import { cn } from '@/lib/utils'

interface SkillsMarqueeProps {
  items: string[]
  speed?: number
  className?: string
}

export function SkillsMarquee({
  items,
  speed = 25,
  className,
}: SkillsMarqueeProps) {
  // Duplicate items 2x for seamless loop
  const duplicatedItems = [...items, ...items]

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <div
        className="flex w-max hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {duplicatedItems.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center shrink-0">
            <span className="text-text-secondary whitespace-nowrap px-2">
              {item}
            </span>
            <span className="text-text-tertiary select-none" aria-hidden="true">
              &middot;
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
