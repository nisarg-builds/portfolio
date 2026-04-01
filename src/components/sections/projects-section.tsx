'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { scrollFadeUp, staggerContainer, fadeUpVariants } from '@/lib/easings'
import { computeTreemapLayout, computeTabletLayout, getTreemapColors } from '@/lib/grid-layout'
import { TreemapProjectCard, TreemapStub } from '@/components/ui/project-card'
import { useTheme } from '@/components/theme-provider'
import type { Project } from '@/lib/projects'

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme === 'light' ? 'light' : 'dark'

  const desktopCells = useMemo(
    () => computeTreemapLayout(projects.length, mode),
    [projects.length, mode]
  )
  const tabletCells = useMemo(
    () => computeTabletLayout(projects.length, mode),
    [projects.length, mode]
  )
  const mobileColors = useMemo(() => getTreemapColors(mode), [mode])

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
        <span className="mb-3 block font-(family-name:--font-mono) text-xs tracking-[0.2em] text-accent/70 uppercase">
          Selected Work
        </span>
        <h2 className="font-(family-name:--font-display) text-4xl font-bold text-text-primary lg:text-5xl">
          Projects
        </h2>
        <div
          className="mt-4 h-px w-full bg-gradient-to-r from-accent/40 via-border to-transparent"
          aria-hidden="true"
        />
      </motion.div>

      {/* Desktop treemap (lg+) */}
      <motion.div
        className="mx-auto hidden max-w-[1200px] lg:grid"
        style={{
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          aspectRatio: '3 / 2',
          gap: '4px',
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
          gap: '4px',
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
