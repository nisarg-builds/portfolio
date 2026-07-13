'use client'

import { cn } from '@/lib/utils'
import { DynamicHeading } from '@/components/ui/dynamic-heading'
import { ZigzagDivider } from '@/components/ui/zigzag-divider'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  divider?: boolean
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  divider = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-8', className)}>
      <DynamicHeading
        text={title}
        as="h2"
        triggerOnScroll
        className="font-display text-4xl font-bold text-ink"
      />
      {divider && (
        <div className="mt-3">
          <ZigzagDivider width={180} className="text-grass" />
        </div>
      )}
      {subtitle && <p className="mt-3 text-lg text-ink-soft">{subtitle}</p>}
    </div>
  )
}
