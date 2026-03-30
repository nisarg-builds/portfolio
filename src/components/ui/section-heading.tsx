'use client'

import { cn } from '@/lib/utils'
import { DynamicHeading } from '@/components/ui/dynamic-heading'
import { WavyDivider } from '@/components/ui/wavy-divider'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  wavyDivider?: boolean
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  wavyDivider = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-8', className)}>
      <DynamicHeading text={title} as="h2" />
      {wavyDivider && <WavyDivider className="mt-3 max-w-[200px]" />}
      {subtitle && (
        <p className="text-text-secondary text-lg mt-2">{subtitle}</p>
      )}
    </div>
  )
}
