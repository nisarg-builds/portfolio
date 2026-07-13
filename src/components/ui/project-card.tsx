'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings } from '@/lib/easings'
import { useIsTouchDevice, usePrefersReducedMotion } from '@/lib/hooks'
import type { Project } from '@/lib/projects'
import type { TreemapColor } from '@/lib/grid-layout'
import { ArrowBolt, Bloom, HalfPipe, Pinwheel, Ring, Star4 } from '@/components/shapes'
import { ProjectMascot } from '@/components/ui/project-mascot'

interface TreemapProjectCardProps {
  project: Project
  color: TreemapColor
  size: 'lg' | 'md' | 'sm'
  style: React.CSSProperties
  index?: number
}

/* Lift + tilt instead of the old zoom + glow */
const cardVariants = {
  rest: {
    x: 0,
    y: 0,
    rotate: 0,
    zIndex: 1,
    transition: { duration: 0.25, ease: easings.easeOut },
  },
  hover: {
    x: -3,
    y: -3,
    rotate: -0.6,
    zIndex: 50,
    transition: easings.springPop,
  },
}

const overlayVariants = {
  rest: {
    y: '100%',
    opacity: 0,
    transition: { duration: 0.25, ease: easings.easeOut },
  },
  hover: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.3, ease: easings.easeOut, delay: 0.05 },
  },
}

const mascotVariants = {
  rest: {
    rotate: 12,
    transition: { duration: 0.3, ease: easings.easeOut },
  },
  hover: {
    rotate: 30,
    transition: easings.springPop,
  },
}

const arrowVariants = {
  rest: {
    x: 0,
    opacity: 0.6,
    transition: { duration: 0.3, ease: easings.easeOut },
  },
  hover: {
    x: 5,
    opacity: 1,
    transition: { duration: 0.3, ease: easings.easeOut },
  },
}

function ProjectChip({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <span
      className={cn(
        'rounded-full border-[1.5px] border-current px-2 py-0.5 font-mono text-[10px] font-semibold',
        muted && 'opacity-60',
      )}
    >
      {label}
    </span>
  )
}

export function TreemapProjectCard({
  project,
  color,
  size,
  style,
  index = 0,
}: TreemapProjectCardProps) {
  const { title, slug, description, tags, role } = project
  const isTouch = useIsTouchDevice()
  const prefersReducedMotion = usePrefersReducedMotion()
  const disableHoverAnimation = isTouch || prefersReducedMotion
  const maxTags = size === 'lg' ? 5 : size === 'md' ? 3 : 2

  return (
    <motion.div
      style={style}
      variants={cardVariants}
      initial="rest"
      whileHover={disableHoverAnimation ? undefined : 'hover'}
      animate="rest"
      className="relative"
    >
      <Link
        href={`/projects/${slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border-2 transition-shadow duration-200 hover:shadow-lift-lg"
        style={{
          backgroundColor: color.bg,
          borderColor: color.border,
          color: color.text,
        }}
        data-cursor="interactive"
      >
        {/* Mascot shape, cropped into the top-right corner */}
        <motion.div
          variants={disableHoverAnimation ? undefined : mascotVariants}
          className={cn(
            'pointer-events-none absolute -right-[8%] -top-[10%] rotate-12',
            size === 'lg' && 'w-[34%]',
            size === 'md' && 'w-[42%]',
            size === 'sm' && 'w-[52%]',
          )}
          aria-hidden="true"
        >
          <ProjectMascot index={index} className="w-full" />
        </motion.div>

        {/* Default content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-4 lg:p-5">
          <div>
            <span className="mb-2 block font-mono text-[10px] tracking-[0.15em] uppercase opacity-70">
              {String(index + 1).padStart(3, '0')}
              {role && size !== 'sm' ? ` · ${role}` : ''}
            </span>
            <h3
              className={cn(
                'font-display font-bold leading-tight',
                size === 'lg' && 'text-2xl lg:text-3xl',
                size === 'md' && 'text-xl',
                size === 'sm' && 'text-base',
              )}
            >
              {title}
            </h3>
            {size === 'lg' && !disableHoverAnimation && (
              <p className="mt-2 line-clamp-2 max-w-[38ch] text-sm leading-relaxed opacity-70">
                {description}
              </p>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between pt-3">
            <span className="font-mono text-[11px] opacity-60 [font-variant-numeric:tabular-nums]">
              {tags.length} {tags.length === 1 ? 'tech' : 'technologies'}
            </span>
            <motion.span
              variants={disableHoverAnimation ? undefined : arrowVariants}
              aria-hidden="true"
            >
              <ArrowBolt className="h-5 w-5" />
            </motion.span>
          </div>
        </div>

        {/* Hover overlay — slides up from bottom */}
        {!disableHoverAnimation && (
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 z-20 flex flex-col justify-end p-4 lg:p-5"
            style={{ backgroundColor: color.bg }}
          >
            <p className="mb-3 line-clamp-3 text-sm leading-relaxed opacity-80">
              {description}
            </p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {tags.slice(0, maxTags).map((tag) => (
                <ProjectChip key={tag} label={tag} />
              ))}
              {tags.length > maxTags && (
                <span className="px-1 font-mono text-[10px] opacity-60">
                  +{tags.length - maxTags}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wide">
              View Project
              <ArrowBolt className="h-3 w-3" />
            </span>
          </motion.div>
        )}

        {/* Touch: show expanded content inline */}
        {disableHoverAnimation && (
          <div className="relative z-10 border-t-2 border-current/20 px-4 pb-4 pt-3">
            <p className="mb-2 line-clamp-2 text-sm leading-relaxed opacity-70">
              {description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, maxTags).map((tag) => (
                <ProjectChip key={tag} label={tag} />
              ))}
              {tags.length > maxTags && (
                <span className="px-1 font-mono text-[10px] opacity-60">
                  +{tags.length - maxTags}
                </span>
              )}
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  )
}

interface TreemapStubProps {
  color: TreemapColor
  style: React.CSSProperties
  index?: number
}

/* Stub shapes rotate through the kit; every fifth one idles in a slow spin */
const STUB_SHAPES: ((className: string, spin: boolean) => React.ReactNode)[] = [
  (c, spin) => <Star4 className={c} spin={spin} />,
  (c) => <Bloom className={c} />,
  (c) => <Ring className={c} />,
  (c) => <HalfPipe className={c} />,
  (c, spin) => <Pinwheel className={c} spin={spin} />,
]

export function TreemapStub({ color, style, index = 0 }: TreemapStubProps) {
  const shape = STUB_SHAPES[index % STUB_SHAPES.length]
  const spins = index % 5 === 4

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-xl bg-canvas-deep"
      style={style}
      aria-hidden="true"
    >
      <div className="w-[38%] max-w-[72px]" style={{ color: color.text }}>
        {shape('w-full', spins)}
      </div>
    </div>
  )
}
