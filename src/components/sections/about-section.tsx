'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { scrollFadeUp, staggerContainer } from '@/lib/easings'

const skills = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'C',
  'HTML',
  'CSS',
  'Tailwind',
  'Bootstrap',
  'GSAP',
  'Framer Motion',
  'Node.js',
  'Express',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Docker',
  'Git',
  'Figma',
  'UI/UX Design',
]

function SkillsMarquee() {
  const doubled = [...skills, ...skills]

  return (
    <div
      className="relative overflow-hidden py-4"
      aria-hidden="true"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <div
        className="flex w-max gap-0 hover:[animation-play-state:paused]"
        style={{ animation: 'marquee 25s linear infinite' }}
      >
        {doubled.map((skill, i) => (
          <span key={i} className="whitespace-nowrap px-3 text-sm text-text-tertiary">
            {skill}
            <span className="ml-3 text-border-hover">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function WavyLine() {
  return (
    <svg
      width="100%"
      height="12"
      viewBox="0 0 287 15"
      fill="none"
      preserveAspectRatio="none"
      className="mt-2 max-w-[200px]"
    >
      <path
        d="M2 6.5C2 6.5 4.6 13 11.8 13C19 13 25.5 2 33.3 2C41 2 46.9 13 55.9 13C65 13 67.6 2 76.8 2C86 2 90.2 13 100.1 13C110 13 111.8 2 120.9 2C130 2 134.9 13 144.2 13C153.5 13 156.6 2 165.1 2C173.5 2 177.2 13 188.3 13C199.5 13 199.9 2 209.2 2C218.5 2 223 13 232.5 13C242 13 244 2 253.3 2C262.6 2 269 13 274.5 13C280 13 285 8.5 285 7.5"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        className="mx-auto max-w-[1120px]"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* Heading */}
        <motion.div variants={scrollFadeUp} className="mb-10">
          <h2 className="font-(family-name:--font-display) text-3xl font-bold text-text-primary">
            About Me
          </h2>
          <WavyLine />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Bio — takes 3 cols on desktop */}
          <motion.div variants={scrollFadeUp} className="lg:col-span-3">
            <div className="space-y-4 text-base text-text-secondary leading-relaxed">
              <p>
                <strong className="text-text-primary">Hello!</strong> My name is
                Nisarg Chaudhary. I&apos;m a Computer Science Honours student at
                the University of Saskatchewan with a minor in Studio Arts.
                Originally from India, I moved to Canada to pursue my passion
                for technology and design.
              </p>
              <p>
                Currently on an internship, I&apos;m passionate about crafting
                beautiful, functional interfaces that bridge the gap between art
                and engineering. I believe the best software feels human — it
                should delight, not just function.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me exploring new
                creative outlets. I love learning new things and keeping myself
                busy — reason #101 why I built this website.
              </p>
            </div>

            <div className="mt-6">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-accent px-4 py-2 text-base text-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-bg"
                data-cursor="interactive"
              >
                Resume
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Portrait — takes 2 cols on desktop */}
          <motion.div variants={scrollFadeUp} className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-border bg-bg-surface">
              <div className="relative aspect-[4/3] lg:aspect-square">
                <Image
                  src="/images/brand/portrait.png"
                  alt="Nisarg Chaudhary"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority={false}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills Marquee — full width */}
        <motion.div variants={scrollFadeUp} className="mt-10">
          <div className="rounded-lg border border-border bg-bg-surface">
            <SkillsMarquee />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
