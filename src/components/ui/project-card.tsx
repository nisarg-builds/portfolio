'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings } from '@/lib/easings'
import { useIsTouchDevice } from '@/lib/hooks'
import type { Project } from '@/lib/projects'
import type { TreemapColor } from '@/lib/grid-layout'

interface TreemapProjectCardProps {
  project: Project
  color: TreemapColor
  size: 'lg' | 'md' | 'sm'
  style: React.CSSProperties
  index?: number
}

const cardVariants = {
  rest: {
    scale: 1,
    zIndex: 1,
    transition: { duration: 0.3, ease: easings.easeOut },
  },
  hover: {
    scale: 1.06,
    zIndex: 50,
    transition: { duration: 0.3, ease: easings.easeOut },
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

const titleVariants = {
  rest: {
    y: 0,
    transition: { duration: 0.3, ease: easings.easeOut },
  },
  hover: {
    y: -16,
    transition: { duration: 0.3, ease: easings.easeOut },
  },
}

const arrowVariants = {
  rest: {
    x: 0,
    opacity: 0.5,
    transition: { duration: 0.3, ease: easings.easeOut },
  },
  hover: {
    x: 4,
    opacity: 1,
    transition: { duration: 0.3, ease: easings.easeOut },
  },
}

// --- Decorative SVG background elements ---

function seededRandom(seed: number) {
  let s = Math.max(1, Math.abs(seed))
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

interface BgElement {
  type: number
  x: number
  y: number
  scale: number
  rotation: number
}

const BG_ELEMENT_COUNT = 8

function generateBgElements(index: number, count: number): BgElement[] {
  const rand = seededRandom((index + 1) * 7919)
  const elements: BgElement[] = []

  for (let i = 0; i < count; i++) {
    elements.push({
      type: Math.floor(rand() * BG_ELEMENT_COUNT) % BG_ELEMENT_COUNT,
      x: 20 + rand() * 60,
      y: 15 + rand() * 60,
      scale: 0.6 + rand() * 0.8,
      rotation: Math.floor(rand() * 360),
    })
  }
  return elements
}

function DottedGrid({ color }: { color: string }) {
  return (
    <g>
      {Array.from({ length: 16 }).map((_, i) => (
        <circle
          key={i}
          cx={(i % 4) * 14}
          cy={Math.floor(i / 4) * 14}
          r="1.5"
          fill={color}
        />
      ))}
    </g>
  )
}

function ConcentricRings({ color }: { color: string }) {
  return (
    <g>
      <circle cx="0" cy="0" r="20" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="0" cy="0" r="14" stroke={color} strokeWidth="0.8" fill="none" />
      <circle cx="0" cy="0" r="8" stroke={color} strokeWidth="0.6" fill="none" />
    </g>
  )
}

function WavyLine({ color }: { color: string }) {
  return (
    <path
      d="M0 10 Q10 0, 20 10 Q30 20, 40 10 Q50 0, 60 10"
      stroke={color}
      strokeWidth="1.2"
      fill="none"
    />
  )
}

function TriangleCluster({ color }: { color: string }) {
  return (
    <g>
      <polygon points="0,-15 13,8 -13,8" stroke={color} strokeWidth="0.8" fill="none" />
      <polygon points="0,15 -10,-2 10,-2" stroke={color} strokeWidth="0.6" fill="none" />
    </g>
  )
}

function Crosshatch({ color }: { color: string }) {
  return (
    <g>
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <line x1={i * 10} y1="0" x2={i * 10} y2="40" stroke={color} strokeWidth="0.6" />
          <line x1="0" y1={i * 10} x2="40" y2={i * 10} stroke={color} strokeWidth="0.6" />
        </g>
      ))}
    </g>
  )
}

function ArcCluster({ color }: { color: string }) {
  return (
    <g>
      <path d="M-20 0 A20 20 0 0 1 20 0" stroke={color} strokeWidth="1" fill="none" />
      <path d="M-14 6 A14 14 0 0 1 14 6" stroke={color} strokeWidth="0.8" fill="none" />
      <path d="M-8 12 A8 8 0 0 1 8 12" stroke={color} strokeWidth="0.6" fill="none" />
    </g>
  )
}

function HexShape({ color }: { color: string }) {
  return (
    <g>
      <polygon
        points="15,0 7.5,13 -7.5,13 -15,0 -7.5,-13 7.5,-13"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
      />
      <polygon
        points="9,0 4.5,7.8 -4.5,7.8 -9,0 -4.5,-7.8 4.5,-7.8"
        stroke={color}
        strokeWidth="0.6"
        fill="none"
      />
    </g>
  )
}

function DiamondGrid({ color }: { color: string }) {
  return (
    <g>
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={col * 16 - 4}
            y={row * 16 - 4}
            width="8"
            height="8"
            transform={`rotate(45, ${col * 16}, ${row * 16})`}
            stroke={color}
            strokeWidth="0.7"
            fill="none"
          />
        ))
      )}
    </g>
  )
}

const BG_ELEMENTS = [DottedGrid, ConcentricRings, WavyLine, TriangleCluster, Crosshatch, ArcCluster, HexShape, DiamondGrid] as const

function CardBackground({ color, index, size }: { color: string; index: number; size: 'lg' | 'md' | 'sm' }) {
  const count = size === 'lg' ? 4 : size === 'md' ? 3 : 2
  const elements = useMemo(() => generateBgElements(index, count), [index, count])
  const opacity = size === 'lg' ? 0.07 : 0.08

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <g opacity={opacity}>
        {elements.map((el, i) => {
          const Element = BG_ELEMENTS[el.type]
          if (!Element) return null
          return (
            <g
              key={i}
              transform={`translate(${el.x}, ${el.y}) scale(${el.scale * 0.4}) rotate(${el.rotation})`}
            >
              <Element color={color} />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

// --- Main components ---

export function TreemapProjectCard({
  project,
  color,
  size,
  style,
  index = 0,
}: TreemapProjectCardProps) {
  const { title, slug, description, tags, role } = project
  const isTouch = useIsTouchDevice()
  const maxTags = size === 'lg' ? 5 : size === 'md' ? 3 : 2

  const hoverBorderColor = `${color.border}80`
  const hoverBoxShadow = `0 0 30px ${color.border}20`
  const restBorderColor = `${color.border}30`

  return (
    <motion.div
      style={style}
      variants={cardVariants}
      initial="rest"
      whileHover={isTouch ? undefined : 'hover'}
      animate="rest"
      className="relative"
    >
      <Link
        href={`/projects/${slug}`}
        className={cn(
          'treemap-card group relative flex h-full flex-col overflow-hidden rounded-lg border transition-all duration-300',
        )}
        style={{
          backgroundColor: color.bg,
          borderColor: restBorderColor,
          '--hover-border': hoverBorderColor,
          '--hover-shadow': hoverBoxShadow,
          '--rest-border': restBorderColor,
        } as React.CSSProperties}
        data-cursor="interactive"
      >
        {/* Decorative background */}
        <CardBackground color={color.border} index={index} size={size} />

        {/* Default content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-4 lg:p-5">
          <div>
            {role && size !== 'sm' && (
              <span
                className="mb-2 block font-(family-name:--font-mono) text-[10px] tracking-[0.15em] uppercase opacity-60"
                style={{ color: color.text }}
              >
                {role}
              </span>
            )}
            <motion.h3
              variants={isTouch ? undefined : titleVariants}
              className={cn(
                'font-(family-name:--font-display) font-semibold leading-tight',
                size === 'lg' && 'text-xl lg:text-2xl',
                size === 'md' && 'text-lg',
                size === 'sm' && 'text-base',
              )}
              style={{ color: color.text }}
            >
              {title}
            </motion.h3>
            {size === 'lg' && !isTouch && (
              <p
                className="mt-2 line-clamp-2 text-sm leading-relaxed opacity-50"
                style={{ color: color.text }}
              >
                {description}
              </p>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between pt-3">
            <span
              className="font-(family-name:--font-mono) text-[11px] opacity-40"
              style={{ color: color.text }}
            >
              {tags.length} {tags.length === 1 ? 'tech' : 'technologies'}
            </span>
            <motion.span
              variants={isTouch ? undefined : arrowVariants}
              className="text-lg"
              style={{ color: color.text }}
              aria-hidden="true"
            >
              &#8599;
            </motion.span>
          </div>
        </div>

        {/* Hover overlay — slides up from bottom */}
        {!isTouch && (
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 z-20 flex flex-col justify-end rounded-lg p-4 lg:p-5"
            style={{
              background: `linear-gradient(to top, ${color.bg} 70%, ${color.bg}dd 85%, transparent)`,
            }}
          >
            <p
              className="mb-3 line-clamp-3 text-sm leading-relaxed"
              style={{ color: `${color.text}cc` }}
            >
              {description}
            </p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {tags.slice(0, maxTags).map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm px-2 py-0.5 font-(family-name:--font-mono) text-[10px]"
                  style={{
                    backgroundColor: `${color.border}20`,
                    color: color.text,
                  }}
                >
                  {tag}
                </span>
              ))}
              {tags.length > maxTags && (
                <span
                  className="px-1 font-(family-name:--font-mono) text-[10px] opacity-50"
                  style={{ color: color.text }}
                >
                  +{tags.length - maxTags}
                </span>
              )}
            </div>
            <span
              className="font-(family-name:--font-mono) text-xs font-medium tracking-wide"
              style={{ color: color.text }}
            >
              View Project &#8594;
            </span>
          </motion.div>
        )}

        {/* Touch: show expanded content inline */}
        {isTouch && (
          <div className="border-t px-4 pb-4" style={{ borderColor: `${color.border}20` }}>
            <p
              className="mb-2 line-clamp-2 text-sm leading-relaxed opacity-60"
              style={{ color: color.text }}
            >
              {description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, maxTags).map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm px-2 py-0.5 font-(family-name:--font-mono) text-[10px]"
                  style={{
                    backgroundColor: `${color.border}20`,
                    color: color.text,
                  }}
                >
                  {tag}
                </span>
              ))}
              {tags.length > maxTags && (
                <span
                  className="px-1 font-(family-name:--font-mono) text-[10px] opacity-50"
                  style={{ color: color.text }}
                >
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

export function TreemapStub({ color, style, index = 0 }: TreemapStubProps) {
  const elements = useMemo(() => generateBgElements(index + 100, 2), [index])

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{
        ...style,
        backgroundColor: `${color.bg}25`,
        border: `1px solid ${color.border}15`,
      }}
      aria-hidden="true"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <g opacity={0.1}>
          {elements.map((el, i) => {
            const Element = BG_ELEMENTS[el.type]
            if (!Element) return null
            return (
              <g
                key={i}
                transform={`translate(${el.x}, ${el.y}) scale(${el.scale * 0.35}) rotate(${el.rotation})`}
              >
                <Element color={color.border} />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
