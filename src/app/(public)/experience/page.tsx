'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'
import { scrollFadeUp, staggerContainer } from '@/lib/easings'

const contributions = [
  {
    color: '#ce796b',
    title: 'AI-powered business profile automation',
    description:
      'Designed and shipped an end-to-end automation system where AI agents autonomously detect incomplete business profiles, generate optimized content, and push updates live. Authored the RFC, built the tool definitions, and wrote the technical guides adopted by the team.',
  },
  {
    color: '#6bcec4',
    title: 'Listing data infrastructure & reliability',
    description:
      'Led migration from brittle web scraping to API-based data collection — eliminating recurring outages and improving data accuracy across thousands of business listings. Enhanced geolocation sync for Apple and Google, and automated real-time syndication.',
  },
  {
    color: '#ceb86b',
    title: 'AI capabilities & developer tooling',
    description:
      'Built MCP tools and prompt modules that give AI agents the ability to diagnose listing score changes and surface actionable insights. Enriched business embeddings with structured attribute data for richer AI context.',
  },
  {
    color: '#6b8ace',
    title: 'Platform reliability & cross-service fixes',
    description:
      'Shipped targeted fixes across gRPC services and data pipelines — resolving address parsing bugs, clearing legacy activation conflicts, and broadening product tier coverage to reduce support escalations.',
  },
]

type TechCategory = 'teal' | 'green' | 'terracotta' | 'blue' | 'gold'

const techPalette: Record<TechCategory, { dark: { color: string; bg: string }; light: { color: string; bg: string } }> = {
  teal:       { dark: { color: '#6bcec4', bg: '#1e2a2d' }, light: { color: '#2b7a70', bg: '#e2f2f0' } },
  green:      { dark: { color: '#6bce8a', bg: '#1e2d22' }, light: { color: '#357a49', bg: '#e2f3e7' } },
  terracotta: { dark: { color: '#ce796b', bg: '#2d1f1e' }, light: { color: '#8c3e32', bg: '#f5e5e3' } },
  blue:       { dark: { color: '#6b8ace', bg: '#1e222d' }, light: { color: '#365090', bg: '#e3e8f5' } },
  gold:       { dark: { color: '#ceb86b', bg: '#2d2a1e' }, light: { color: '#8a7635', bg: '#f3f0e0' } },
}

const technologies: { name: string; category: TechCategory }[] = [
  { name: 'Go', category: 'teal' },
  { name: 'gRPC', category: 'teal' },
  { name: 'Temporal', category: 'teal' },
  { name: 'Python', category: 'green' },
  { name: 'AI/ML', category: 'terracotta' },
  { name: 'MCP Tools', category: 'terracotta' },
  { name: 'Elasticsearch', category: 'blue' },
  { name: 'Docker', category: 'blue' },
  { name: 'GCP', category: 'blue' },
  { name: 'Jira', category: 'gold' },
  { name: 'Confluence', category: 'gold' },
]

const stats = [
  { value: '8+', label: 'Repositories' },
  { value: '50+', label: 'PRs Merged' },
  { value: '3', label: 'RFCs Authored' },
  { value: '1', label: 'Year' },
]

export default function ExperiencePage() {
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme === 'light' ? 'light' : 'dark'

  return (
    <main className="relative px-5 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-32 lg:pt-12">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 -top-20"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(206, 121, 107, 0.05) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative mx-auto max-w-[800px]"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Hero header */}
        <motion.div variants={scrollFadeUp} className="mb-12">
          <span className="mb-3 block font-(family-name:--font-mono) text-xs tracking-[0.2em] text-accent/70 uppercase">
            Work Experience
          </span>
          <h1 className="font-(family-name:--font-display) text-4xl font-bold text-text-primary lg:text-5xl">
            Experience
          </h1>
          <p className="mt-4 max-w-[560px] text-base text-text-secondary leading-relaxed">
            Where I&apos;ve been building software that matters — bridging
            engineering and design in the real world.
          </p>
        </motion.div>

        {/* Role card */}
        <motion.div
          variants={scrollFadeUp}
          className="card-shine relative overflow-hidden rounded-2xl border border-border bg-bg-surface p-6 sm:p-8 lg:p-10"
        >
          {/* Decorative background pattern */}
          <svg
            className="pointer-events-none absolute right-4 top-4 h-28 w-28 opacity-[0.06] sm:h-36 sm:w-36"
            viewBox="0 0 120 120"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="0.5"
            aria-hidden="true"
          >
            <circle cx="60" cy="60" r="20" />
            <circle cx="60" cy="60" r="35" />
            <circle cx="60" cy="60" r="50" />
            <line x1="60" y1="5" x2="60" y2="115" />
            <line x1="5" y1="60" x2="115" y2="60" />
          </svg>

          {/* Card header */}
          <div className="relative">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 font-(family-name:--font-mono) text-xs text-green-400">
              <span
                className="h-1.5 w-1.5 rounded-full bg-green-400"
                style={{ animation: 'ambient-pulse 2s ease-in-out infinite' }}
                aria-hidden="true"
              />
              CURRENT ROLE
            </span>
            <h2 className="mt-2 font-(family-name:--font-display) text-3xl font-bold text-text-primary sm:text-4xl">
              Vendasta
            </h2>
            <p className="mt-1 text-lg font-medium text-accent">
              Developer I
            </p>
            <p className="mt-1.5 font-(family-name:--font-mono) text-xs tracking-wider text-text-tertiary uppercase">
              May 2025 — Present · Saskatoon, SK
            </p>
          </div>

          {/* Stats row */}
          <motion.div
            variants={scrollFadeUp}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-bg/60 px-4 py-3 text-center"
              >
                <span className="block font-(family-name:--font-display) text-xl font-bold text-accent">
                  {stat.value}
                </span>
                <span className="mt-0.5 block font-(family-name:--font-mono) text-[10px] tracking-wider text-text-tertiary uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Divider */}
          <div
            className="my-8 h-px"
            style={{
              background:
                'linear-gradient(to right, var(--color-accent), rgba(206,121,107,0.2), transparent)',
            }}
            aria-hidden="true"
          />

          {/* What I Do */}
          <motion.div variants={scrollFadeUp} className="mb-10">
            <span className="mb-3 block font-(family-name:--font-mono) text-xs tracking-[0.15em] text-text-tertiary uppercase">
              What I Do
            </span>
            <p className="text-base text-text-secondary leading-relaxed">
              I build AI-powered automation and data infrastructure that serve
              the backbone of a platform used by thousands of businesses. My work
              spans backend systems in Go, real-time data pipelines, and
              AI agent tooling — shipping features that directly reduce manual
              work and improve platform reliability.
            </p>
          </motion.div>

          {/* Key Contributions */}
          <motion.div variants={scrollFadeUp} className="mb-10">
            <span className="mb-5 block font-(family-name:--font-mono) text-xs tracking-[0.15em] text-text-tertiary uppercase">
              Key Contributions
            </span>
            <div>
              {contributions.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={scrollFadeUp}
                  className="relative flex gap-4"
                >
                  {/* Dot + connector line */}
                  <div className="flex flex-col items-center pt-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 0 3px ${item.color}20`,
                      }}
                      aria-hidden="true"
                    />
                    {i < contributions.length - 1 && (
                      <div
                        className="mt-1 w-px flex-1"
                        style={{
                          background: `linear-gradient(to bottom, ${item.color}40, ${contributions[i + 1].color}40)`,
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn('pb-7', i === contributions.length - 1 && 'pb-0')}>
                    <h3 className="text-sm font-semibold text-text-primary leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-text-secondary/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <div
            className="mb-8 h-px"
            style={{
              background:
                'linear-gradient(to right, transparent, var(--color-border), transparent)',
            }}
            aria-hidden="true"
          />

          {/* Technologies */}
          <motion.div variants={scrollFadeUp}>
            <span className="mb-4 block font-(family-name:--font-mono) text-xs tracking-[0.15em] text-text-tertiary uppercase">
              Technologies
            </span>
            <motion.div
              className="flex flex-wrap gap-2"
              variants={staggerContainer}
            >
              {technologies.map((tech) => {
                const palette = techPalette[tech.category][mode]
                return (
                  <motion.span
                    key={tech.name}
                    variants={scrollFadeUp}
                    className="inline-block rounded-md border px-3 py-1 font-(family-name:--font-mono) text-xs transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: palette.bg,
                      borderColor: `${palette.color}30`,
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
          <blockquote className="text-base italic text-text-tertiary leading-relaxed">
            &ldquo;I believe great software is built at the intersection of
            engineering rigor and genuine care for the people who use it.&rdquo;
          </blockquote>
          <div
            className="mx-auto mt-5 flex items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent/30" />
            <span className="text-xs text-accent/50">&#10038;</span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent/30" />
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}
