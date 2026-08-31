'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsTouchDevice, usePrefersReducedMotion } from '@/lib/hooks'
import type { Project } from '@/lib/projects'

const EASE = [0.16, 1, 0.3, 1] as const
const PREVIEW_WIDTH = 340
const PREVIEW_HEIGHT = 220

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3.5 10.5 10.5 3.5M10.5 3.5H5m5.5 0V9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The work, set as an index rather than a grid of tiles.
 *
 * A printed catalogue lists its plates as rows and reproduces them on the
 * facing page; here the facing page is the cursor. Hovering a row lifts the
 * project's real screenshot under the pointer, so the images finally do some
 * work instead of being cropped into cards nobody reads.
 *
 * The preview is purely decorative — every row is a plain link, and the same
 * imagery is on the detail page — so keyboard and touch users lose nothing
 * when it never appears.
 */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const isTouch = useIsTouchDevice()
  const prefersReducedMotion = usePrefersReducedMotion()
  const showPreview = !isTouch && !prefersReducedMotion

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 380, damping: 34, mass: 0.6 })
  const y = useSpring(pointerY, { stiffness: 380, damping: 34, mass: 0.6 })

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLUListElement>) => {
      if (!showPreview) return
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
    },
    [pointerX, pointerY, showPreview],
  )

  const handleEnter = useCallback(
    (index: number, event: React.PointerEvent<HTMLAnchorElement>) => {
      // Nothing to preview for a project that has no imagery yet.
      if (!showPreview || !projects[index]?.image) return
      // Jump the springs themselves, not just their source: otherwise the
      // panel eases in from wherever the last hover left it, which reads as
      // lag rather than as following the pointer.
      pointerX.jump(event.clientX)
      pointerY.jump(event.clientY)
      x.jump(event.clientX)
      y.jump(event.clientY)
      setActiveIndex(index)
    },
    [pointerX, pointerY, x, y, showPreview, projects],
  )

  const active = activeIndex === null ? null : projects[activeIndex]
  const activeProject = active?.image ? active : null

  return (
    <>
      <ul
        ref={listRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setActiveIndex(null)}
        className="border-b border-(--color-line)"
      >
        {projects.map((project, index) => {
          const isDimmed = activeIndex !== null && activeIndex !== index

          return (
            <li key={project.slug} className="border-t border-(--color-line)">
              <Link
                href={`/projects/${project.slug}`}
                onPointerEnter={(event) => handleEnter(index, event)}
                className="group block py-6 transition-opacity duration-300 sm:py-7 lg:py-8"
                style={{ opacity: isDimmed ? 0.4 : 1 }}
                data-cursor="interactive"
              >
                <div className="flex items-start gap-4 sm:gap-6 lg:items-baseline lg:gap-8">
                  <span
                    className="numeral mt-1.5 shrink-0 text-[0.6875rem] text-text-tertiary transition-colors duration-300 group-hover:text-accent lg:mt-0"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1 lg:grid lg:grid-cols-12 lg:items-baseline lg:gap-8">
                    <h3 className="font-(family-name:--font-display) text-2xl font-medium tracking-[-0.03em] text-text-primary transition-transform duration-500 ease-out group-hover:translate-x-1.5 lg:col-span-5">
                      {project.title}
                    </h3>

                    <div className="mt-3 lg:col-span-5 lg:mt-0">
                      {project.role && (
                        <p className="meta text-accent">{project.role}</p>
                      )}
                      <p className="meta mt-1.5 text-text-tertiary normal-case tracking-[0.06em]">
                        {project.tags.join('  ·  ')}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-4 lg:col-span-2 lg:mt-0 lg:justify-end">
                      {project.year && (
                        <span className="meta numeral text-text-tertiary">
                          {project.year}
                        </span>
                      )}
                      <Arrow className="text-text-tertiary transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent" />
                    </div>
                  </div>
                </div>

                {/* Mobile keeps the image inline — there is no cursor to follow. */}
                {project.image && (
                  <div className="relative mt-5 aspect-[16/10] overflow-hidden border border-(--color-line) bg-bg-surface sm:hidden">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      className="object-cover object-top"
                      sizes="100vw"
                    />
                  </div>
                )}
                <p className="mt-4 text-sm text-text-secondary sm:hidden">
                  {project.description}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>

      {showPreview && (
        <AnimatePresence>
          {activeProject && (
            <motion.div
              key={activeProject.slug}
              className="pointer-events-none fixed left-0 top-0 z-30 hidden sm:block"
              style={{ x, y, translateX: '-50%', translateY: '-50%' }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: EASE }}
              aria-hidden="true"
            >
              <div
                className="relative overflow-hidden border border-(--color-line) bg-bg-surface shadow-[var(--shadow-elevated)]"
                style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
              >
                <Image
                  src={activeProject.image}
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes={`${PREVIEW_WIDTH}px`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  )
}
