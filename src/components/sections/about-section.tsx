'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollFadeUp, staggerContainer } from '@/lib/easings'
import { WavyDivider } from '@/components/ui/wavy-divider'

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
      className="relative overflow-hidden py-5"
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
          <span
            key={i}
            className="whitespace-nowrap px-3 text-[15px] text-text-secondary"
          >
            {skill}
            <span className="ml-3 text-accent/40">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}


interface AboutSectionProps {
  portraitUrl: string
  portraitCrop?: { x: number; y: number; width: number; height: number } | null
}

export function AboutSection({ portraitUrl, portraitCrop }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (!portraitRef.current || !sectionRef.current) return

      gsap.to(portraitRef.current, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="px-5 py-20 sm:px-6 lg:px-8 lg:py-32">
      <motion.div
        className="mx-auto max-w-[1120px]"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* Heading */}
        <motion.div variants={scrollFadeUp} className="relative mb-12">
          <span
            className="pointer-events-none absolute top-[-0.15em] left-[-0.03em] select-none font-(family-name:--font-display) text-[15vw] font-bold leading-none text-text-primary opacity-[0.03] lg:text-[12vw]"
            aria-hidden="true"
          >
            01
          </span>
          <h2 className="font-(family-name:--font-display) text-3xl font-bold text-text-primary">
            About Me
          </h2>
          <WavyDivider width={200} />
          <div
            className="mt-3 h-[2px] w-20"
            style={{
              background:
                'linear-gradient(to right, var(--color-accent), transparent)',
            }}
            aria-hidden="true"
          />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Bio — takes 3 cols on desktop */}
          <motion.div variants={scrollFadeUp} className="lg:col-span-3">
            <div className="space-y-5 border-l-2 border-accent/30 pl-5 text-base text-text-secondary leading-relaxed" data-cursor="text">
              <p className="text-lg">
                <strong className="text-accent">Hello!</strong> My name is
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

            <div className="mt-8">
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex items-center gap-2.5 rounded-lg border border-accent/60 px-6 py-3 text-base font-medium text-accent transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-bg"
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
          <motion.div variants={scrollFadeUp} className="lg:col-span-2 lg:-ml-10 relative z-10">
            <div ref={portraitRef}>
              <div
                className="overflow-hidden rounded-2xl border border-border border-l-[3px] border-l-accent bg-bg-surface"
                style={{
                  boxShadow: '0 0 60px rgba(206, 121, 107, 0.1)',
                }}
              >
                <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden">
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
              </div>
              <div className="mt-3 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-surface/80 px-3 py-1 text-xs text-text-tertiary">
                  <span aria-hidden="true">📍</span> Saskatchewan, Canada
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills Marquee — full width */}
        <motion.div variants={scrollFadeUp} className="mt-14">
          <span className="mb-2 block font-(family-name:--font-mono) text-xs tracking-widest text-text-tertiary uppercase">
            Technologies & Tools
          </span>
          <div
            className="rounded-lg border border-border"
            style={{
              background:
                'linear-gradient(135deg, var(--color-bg-surface) 0%, var(--color-bg) 50%, var(--color-bg-surface) 100%)',
            }}
          >
            <SkillsMarquee />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
