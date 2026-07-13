'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { scrollFadeUp, staggerContainer, fadeUpVariants } from '@/lib/easings'
import { computeTreemapLayout, computeTabletLayout, TREEMAP_COLORS } from '@/lib/grid-layout'
import { TreemapProjectCard, TreemapStub } from '@/components/ui/project-card'
import type { Project } from '@/lib/projects'

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const desktopCells = useMemo(
    () => computeTreemapLayout(projects.length),
    [projects.length]
  )
  const tabletCells = useMemo(
    () => computeTabletLayout(projects.length),
    [projects.length]
  )
  const mobileColors = TREEMAP_COLORS

  return (
    <section id="projects" className="px-5 sm:px-6 lg:px-8">
      {/* Section heading */}
      <motion.div
        className="mx-auto max-w-[1200px] pt-20 pb-8 lg:pt-32 lg:pb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={scrollFadeUp}
      >
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3.5 py-1.5 font-mono text-xs font-semibold tracking-[0.14em] text-ink uppercase">
          <svg viewBox="0 0 100 100" className="h-3 w-3 text-tangerine" aria-hidden="true">
            <path
              fill="currentColor"
              d="M50 4 C54 28 62 40 96 50 C62 60 54 72 50 96 C46 72 38 60 4 50 C38 40 46 28 50 4 Z"
            />
          </svg>
          Selected Work
        </span>
        <h2 className="font-display text-4xl font-bold text-ink">
          Projects
        </h2>
      </motion.div>

      {/* Desktop treemap (lg+) */}
      <motion.div
        className="mx-auto hidden max-w-[1200px] lg:grid"
        style={{
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          aspectRatio: '3 / 2',
          gap: '10px',
        }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {desktopCells.map((cell, i) => {
          const project = cell.type === 'project' && cell.projectIndex != null
            ? projects[cell.projectIndex]
            : null
          return (
            <motion.div key={`d-${cell.gridArea}`} variants={fadeUpVariants} style={{ gridArea: cell.gridArea }}>
              {project ? (
                <TreemapProjectCard
                  project={project}
                  color={cell.color}
                  size={cell.size}
                  style={{ height: '100%' }}
                  index={cell.projectIndex!}
                />
              ) : (
                <TreemapStub
                  color={cell.color}
                  style={{ height: '100%' }}
                  index={i}
                />
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Tablet treemap (md to lg) */}
      <motion.div
        className="mx-auto hidden max-w-[800px] md:grid lg:hidden"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(4, minmax(120px, 1fr))',
          gap: '10px',
        }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {tabletCells.map((cell, i) => {
          const project = cell.type === 'project' && cell.projectIndex != null
            ? projects[cell.projectIndex]
            : null
          return (
            <motion.div key={`t-${cell.gridArea}`} variants={fadeUpVariants} style={{ gridArea: cell.gridArea }}>
              {project ? (
                <TreemapProjectCard
                  project={project}
                  color={cell.color}
                  size={cell.size}
                  style={{ height: '100%' }}
                  index={cell.projectIndex!}
                />
              ) : (
                <TreemapStub
                  color={cell.color}
                  style={{ height: '100%' }}
                  index={i}
                />
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Mobile stack */}
      <motion.div
        className="mx-auto flex max-w-[500px] flex-col gap-3 md:hidden"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {projects.map((project, i) => (
          <motion.div key={project.slug} variants={fadeUpVariants}>
            <TreemapProjectCard
              project={project}
              color={mobileColors[i % mobileColors.length]}
              size="md"
              style={{}}
              index={i}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
