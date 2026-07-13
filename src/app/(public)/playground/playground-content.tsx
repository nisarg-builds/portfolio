'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DynamicHeading } from '@/components/ui/dynamic-heading'
import { ZigzagDivider } from '@/components/ui/zigzag-divider'
import { scrollFadeUp, staggerContainer, easings } from '@/lib/easings'
import { ArrowBolt, Pinwheel, Star4 } from '@/components/shapes'

function FitGlassLogo() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="text-blurple"
    >
      <path
        d="M13 5C19 12 19 24 13 31"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M23 5C17 12 17 24 23 31"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

interface Experiment {
  title: string
  description: string
  icon: ReactNode
  status: 'coming-soon' | 'live' | 'external'
  link?: string
  /** Tile surface — ink text must stay AA on it */
  tileClassName: string
}

const experiments: Experiment[] = [
  {
    title: 'Fit Glass',
    description:
      'AI-powered nutrition tracking — snap a photo of your meal and get instant calorie & macro breakdowns.',
    icon: <FitGlassLogo />,
    status: 'live',
    link: '/fitglass',
    tileClassName: 'bg-paper',
  },
  {
    title: 'Pathfinding Visualizer',
    description:
      'Interactive visualization of A*, BFS, and Dijkstra algorithms',
    icon: <ArrowBolt className="h-11 w-11 text-ink" />,
    status: 'external',
    link: 'https://github.com/nisarg-11-here/Pathfinding_Visualizer',
    tileClassName: 'bg-tangerine',
  },
  {
    title: 'Generative Art',
    description: 'Procedural patterns and creative coding with p5.js',
    icon: <Pinwheel className="h-11 w-11 text-grape" />,
    status: 'coming-soon',
    tileClassName: 'bg-canvas-deep',
  },
]

const cardVariant = {
  hidden: { opacity: 0, scale: 0.6, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: easings.springPop,
  },
}

export function PlaygroundPageContent() {
  return (
    <main className="min-h-dvh px-5 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <motion.div
        className="mx-auto max-w-[1120px]"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={scrollFadeUp}>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3.5 py-1.5 font-mono text-xs font-semibold tracking-[0.14em] text-ink uppercase">
            <Star4 className="h-3 w-3 text-sky" />
            Experiments
          </span>
          <DynamicHeading
            text="Playground"
            as="h1"
            className="font-display text-4xl font-bold text-ink"
          />
          <div className="mt-3">
            <ZigzagDivider width={160} className="text-sky" />
          </div>
          <p className="mt-4 text-base text-ink-soft">
            Interactive experiments and creative coding — the toy shelf.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {experiments.map((exp) => (
            <motion.div
              key={exp.title}
              variants={cardVariant}
              className={cn(
                'flex flex-col items-start rounded-xl border-2 p-6 transition-[transform,box-shadow] duration-200',
                exp.status === 'coming-soon'
                  ? 'border-dashed border-ink/60'
                  : 'border-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:rotate-[-0.5deg] hover:shadow-lift',
                exp.tileClassName,
              )}
            >
              <span aria-hidden="true">{exp.icon}</span>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">
                {exp.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {exp.description}
              </p>
              <div className="mt-5">
                {exp.status === 'live' && exp.link ? (
                  <Link
                    href={exp.link}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-4 py-1.5 font-display text-sm font-bold text-canvas transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift-blurple"
                    data-cursor="interactive"
                  >
                    Launch App
                    <ArrowBolt className="h-3.5 w-3.5" />
                  </Link>
                ) : exp.link ? (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-1.5 font-display text-sm font-bold text-ink transition-[transform,box-shadow,background-color] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime hover:shadow-lift"
                    data-cursor="interactive"
                  >
                    View Project
                    <ArrowBolt className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="inline-flex items-center rounded-full border-[1.5px] border-ink/60 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-ink-soft uppercase">
                    Coming soon
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={scrollFadeUp}
          className="mt-12 flex items-center justify-center gap-2 text-center font-mono text-xs text-ink-faint"
        >
          <Star4 className="h-3 w-3 text-tangerine" />
          More experiments coming soon
        </motion.p>
      </motion.div>
    </main>
  )
}
