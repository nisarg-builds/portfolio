'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { scrollFadeUp, staggerContainer } from '@/lib/easings'
import { usePrefersReducedMotion } from '@/lib/hooks'
import { ZigzagDivider } from '@/components/ui/zigzag-divider'
import { MarqueeBand } from '@/components/ui/marquee-band'
import { StickerChip } from '@/components/ui/sticker-chip'
import { Star4 } from '@/components/shapes'

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

/* Arch-topped window (solid, no inner cutout — it frames a face) */
const ARCH_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M6 100 V44 C6 18 26 2 50 2 C74 2 94 18 94 44 V100 Z' fill='black'/%3E%3C/svg%3E\")"

interface AboutSectionProps {
  portraitUrl: string
  portraitCrop?: { x: number; y: number; width: number; height: number } | null
}

export function AboutSection({ portraitUrl, portraitCrop }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )

  // Portrait parallax — Framer Motion useScroll (GSAP retired from the portfolio)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const portraitY = prefersReducedMotion || !isDesktop ? undefined : parallaxY

  return (
    <section ref={sectionRef} id="about" className="relative px-5 py-20 sm:px-6 lg:px-8 lg:py-32">
      <motion.div
        className="mx-auto max-w-[1120px]"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* Heading */}
        <motion.div variants={scrollFadeUp} className="relative mb-12">
          <h2 className="font-display text-4xl font-bold text-ink">About Me</h2>
          <div className="mt-3">
            <ZigzagDivider width={180} className="text-grass" />
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Bio — takes 3 cols on desktop */}
          <motion.div variants={scrollFadeUp} className="lg:col-span-3">
            <div
              className="space-y-5 border-l-[3px] border-ink pl-5 text-base leading-relaxed text-ink-soft"
              data-cursor="text"
            >
              <p className="text-lg">
                <strong className="text-blurple">Hello!</strong> My name is
                Nisarg Chaudhary. I&apos;m a Computer Science Honours student at
                the University of Saskatchewan with a minor in Studio Arts.
                Originally from India, I moved to Canada to pursue my passion
                for technology and design.
              </p>
              <p>
                Currently a Developer I at{' '}
                <strong className="text-ink">Vendasta</strong>, I&apos;m
                building AI-powered automation and listing data infrastructure
                with Go, gRPC, and Temporal. I&apos;m passionate about crafting
                beautiful, functional interfaces that bridge the gap between art
                and engineering.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me exploring new
                creative outlets. I love learning new things and keeping myself
                busy — reason #101 why I built this website.
              </p>
            </div>

            <div className="mt-8">
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-ink px-6 py-3 font-display text-base font-bold text-ink transition-[transform,box-shadow,background-color] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime hover:shadow-lift"
                data-cursor="interactive"
                whileHover="hover"
              >
                Resume
                <motion.svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  variants={{
                    hover: { x: 3 },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Portrait — takes 2 cols on desktop */}
          <motion.div variants={scrollFadeUp} className="relative z-10 lg:col-span-2 lg:-ml-10">
            <motion.div style={{ y: portraitY }}>
              <div className="relative rounded-2xl border-2 border-ink bg-lilac p-5 sm:p-6">
                <div
                  className="relative aspect-[4/3] overflow-hidden lg:aspect-[4/5]"
                  style={{
                    maskImage: ARCH_MASK,
                    WebkitMaskImage: ARCH_MASK,
                    maskSize: '100% 100%',
                    WebkitMaskSize: '100% 100%',
                  }}
                >
                  <Image
                    src={portraitUrl}
                    alt="Nisarg Chaudhary"
                    fill
                    className="object-cover"
                    style={portraitCrop ? {
                      objectPosition: `${portraitCrop.x}% ${portraitCrop.y}%`,
                      transform: `scale(${100 / Math.min(portraitCrop.width, portraitCrop.height)})`,
                      transformOrigin: `${portraitCrop.x}% ${portraitCrop.y}%`,
                    } : undefined}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority={false}
                  />
                </div>
                <Star4
                  className="absolute -right-4 -top-4 w-10 text-tangerine"
                />
              </div>
              <div className="mt-4 flex justify-center">
                <StickerChip hue="grass">Saskatchewan, Canada</StickerChip>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Skills band eyebrow */}
        <motion.div variants={scrollFadeUp} className="mt-16">
          <span className="mb-4 flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-ink-soft uppercase">
            <Star4 className="h-3 w-3 text-grass" />
            Technologies &amp; Tools
          </span>
        </motion.div>
      </motion.div>

      {/* Full-bleed skills marquee */}
      <motion.div
        className="-mx-5 sm:-mx-6 lg:-mx-8"
        variants={scrollFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <MarqueeBand items={skills} label="Technologies and tools" />
      </motion.div>
    </section>
  )
}
