'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { scrollFadeUp, staggerContainer } from '@/lib/easings'
import { StatSticker } from '@/components/ui/stat-sticker'
import { ZigzagDivider } from '@/components/ui/zigzag-divider'
import { Loops, Star4 } from '@/components/shapes'

const contributions = [
  {
    color: '#4b48e8',
    title: 'AI-powered business profile automation',
    description:
      'Designed and shipped an end-to-end automation system where AI agents autonomously detect incomplete business profiles, generate optimized content, and push updates live. Authored the RFC, built the tool definitions, and wrote the technical guides adopted by the team.',
  },
  {
    color: '#2fbe5b',
    title: 'Listing data infrastructure & reliability',
    description:
      'Led migration from brittle web scraping to API-based data collection — eliminating recurring outages and improving data accuracy across thousands of business listings. Enhanced geolocation sync for Apple and Google, and automated real-time syndication.',
  },
  {
    color: '#f421be',
    title: 'AI capabilities & developer tooling',
    description:
      'Built MCP tools and prompt modules that give AI agents the ability to diagnose listing score changes and surface actionable insights. Enriched business embeddings with structured attribute data for richer AI context.',
  },
  {
    color: '#ff7a1f',
    title: 'Platform reliability & cross-service fixes',
    description:
      'Shipped targeted fixes across gRPC services and data pipelines — resolving address parsing bugs, clearing legacy activation conflicts, and broadening product tier coverage to reduce support escalations.',
  },
]

type TechCategory = 'sky' | 'grass' | 'tangerine' | 'blurple' | 'lime'

const techPalette: Record<TechCategory, { color: string; bg: string }> = {
  sky:       { color: '#101010', bg: '#29b5ef' },
  grass:     { color: '#101010', bg: '#2fbe5b' },
  tangerine: { color: '#101010', bg: '#ff7a1f' },
  blurple:   { color: '#fbfdf7', bg: '#4b48e8' },
  lime:      { color: '#101010', bg: '#ddf163' },
}

const technologies: { name: string; category: TechCategory }[] = [
  { name: 'Go', category: 'sky' },
  { name: 'gRPC', category: 'sky' },
  { name: 'Temporal', category: 'sky' },
  { name: 'Python', category: 'grass' },
  { name: 'AI/ML', category: 'tangerine' },
  { name: 'MCP Tools', category: 'tangerine' },
  { name: 'Elasticsearch', category: 'blurple' },
  { name: 'Docker', category: 'blurple' },
  { name: 'GCP', category: 'blurple' },
  { name: 'Jira', category: 'lime' },
  { name: 'Confluence', category: 'lime' },
]

const stats = [
  { value: '8+', label: 'Repositories', hue: 'bg-lilac' },
  { value: '50+', label: 'PRs Merged', hue: 'bg-lime' },
  { value: '3', label: 'RFCs Authored', hue: 'bg-sky' },
  { value: '1', label: 'Year', hue: 'bg-tangerine' },
]

export default function ExperiencePage() {
  return (
    <main className="relative px-5 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-32 lg:pt-12">
      <motion.div
        className="relative mx-auto max-w-[800px]"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Hero header */}
        <motion.div variants={scrollFadeUp} className="mb-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3.5 py-1.5 font-mono text-xs font-semibold tracking-[0.14em] text-ink uppercase">
            <Star4 className="h-3 w-3 text-grass" />
            Work Experience
          </span>
          <h1 className="font-display text-4xl font-bold text-ink">
            Experience
          </h1>
          <p className="mt-4 max-w-[560px] text-base text-ink-soft leading-relaxed">
            Where I&apos;ve been building software that matters — bridging
            engineering and design in the real world.
          </p>
        </motion.div>

        {/* Role card */}
        <motion.div
          variants={scrollFadeUp}
          className="relative overflow-hidden rounded-2xl border-2 border-ink bg-paper p-6 sm:p-8 lg:p-10"
        >
          {/* Corner shape */}
          <div
            className="pointer-events-none absolute -right-8 -top-10 w-32 rotate-12 sm:w-40"
            aria-hidden="true"
          >
            <Loops className="w-full text-sky [--loops-inner:var(--color-lilac)]" />
          </div>

          {/* Card header */}
          <div className="relative">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-lime px-3 py-1 font-mono text-xs font-semibold text-ink">
              <span
                className="h-1.5 w-1.5 rounded-full bg-grass"
                style={{ animation: 'ambient-pulse 2s ease-in-out infinite' }}
                aria-hidden="true"
              />
              CURRENT ROLE
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
              Vendasta
            </h2>
            <p className="mt-1 font-display text-lg font-bold text-blurple">
              Developer I
            </p>
            <p className="mt-1.5 font-mono text-xs tracking-wider text-ink-faint uppercase">
              May 2025 — Present · Saskatoon, SK
            </p>
          </div>

          {/* Stats row */}
          <motion.div
            variants={scrollFadeUp}
            className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <StatSticker
                key={stat.label}
                value={stat.value}
                label={stat.label}
                hueClassName={stat.hue}
              />
            ))}
          </motion.div>

          {/* Divider */}
          <div className="my-8 h-px bg-ink/15" aria-hidden="true" />

          {/* What I Do */}
          <motion.div variants={scrollFadeUp} className="relative mb-10">
            <span className="mb-3 block font-mono text-xs font-semibold tracking-[0.15em] text-ink-soft uppercase">
              What I Do
            </span>
            <p className="text-base text-ink-soft leading-relaxed">
              I build AI-powered automation and data infrastructure that serve
              the backbone of a platform used by thousands of businesses. My work
              spans backend systems in Go, real-time data pipelines, and
              AI agent tooling — shipping features that directly reduce manual
              work and improve platform reliability.
            </p>
          </motion.div>

          {/* Key Contributions */}
          <motion.div variants={scrollFadeUp} className="mb-10">
            <span className="mb-5 block font-mono text-xs font-semibold tracking-[0.15em] text-ink-soft uppercase">
              Key Contributions
            </span>
            <div>
              {contributions.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={scrollFadeUp}
                  className="relative flex gap-4"
                >
                  {/* Star marker + connector line */}
                  <div className="flex flex-col items-center pt-1.5">
                    <span className="shrink-0" style={{ color: item.color }} aria-hidden="true">
                      <Star4 className="h-4 w-4" />
                    </span>
                    {i < contributions.length - 1 && (
                      <div className="mt-1.5 w-px flex-1 bg-ink/15" aria-hidden="true" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn('pb-7', i === contributions.length - 1 && 'pb-0')}>
                    <h3 className="text-sm text-ink leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="mb-8 h-px bg-ink/15" aria-hidden="true" />

          {/* Technologies */}
          <motion.div variants={scrollFadeUp}>
            <span className="mb-4 block font-mono text-xs font-semibold tracking-[0.15em] text-ink-soft uppercase">
              Technologies
            </span>
            <motion.div
              className="flex flex-wrap gap-2"
              variants={staggerContainer}
            >
              {technologies.map((tech) => {
                const palette = techPalette[tech.category]
                return (
                  <motion.span
                    key={tech.name}
                    variants={scrollFadeUp}
                    className="inline-block rounded-full border-[1.5px] border-ink px-3 py-1 font-mono text-xs font-semibold transition-transform duration-200 hover:-rotate-3 hover:scale-105"
                    style={{
                      backgroundColor: palette.bg,
                      color: palette.color,
                    }}
                  >
                    {tech.name}
                  </motion.span>
                )
              })}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom quote */}
        <motion.div variants={scrollFadeUp} className="mt-14 text-center">
          <blockquote className="text-base italic text-ink-soft leading-relaxed">
            &ldquo;I believe great software is built at the intersection of
            engineering rigor and genuine care for the people who use it.&rdquo;
          </blockquote>
          <div className="mx-auto mt-6 flex justify-center" aria-hidden="true">
            <ZigzagDivider width={80} className="text-tangerine" />
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}
