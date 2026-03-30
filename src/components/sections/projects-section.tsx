'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { scrollFadeUp } from '@/lib/easings'
import type { Project } from '@/lib/projects'

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-sm border border-border bg-bg-elevated px-3 py-1 font-(family-name:--font-mono) text-xs text-text-secondary transition-colors duration-300 group-hover:border-accent/20 group-hover:text-accent/80">
      {children}
    </span>
  )
}

function ProjectCard({
  title,
  slug,
  description,
  image,
  tags,
  featured,
}: {
  title: string
  slug: string
  description: string
  image: string
  tags: string[]
  featured?: boolean
}) {
  return (
    <motion.div
      variants={scrollFadeUp}
      className={`will-change-transform ${featured ? 'md:col-span-2' : ''}`}
    >
      <Link
        href={`/projects/${slug}`}
        className={`card-shine group block overflow-hidden rounded-lg border border-border bg-bg-surface transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(206,121,107,0.08)] ${featured ? 'border-l-[3px] border-l-accent/40' : ''}`}
        data-cursor="interactive"
      >
        <div className="overflow-hidden">
          <div
            className={`relative ${featured ? 'aspect-[21/9]' : 'aspect-video'}`}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.7]"
              sizes={
                featured
                  ? '(max-width: 768px) 100vw, 80vw'
                  : '(max-width: 768px) 100vw, 40vw'
              }
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-surface/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            {featured && (
              <span className="absolute top-3 right-3 rounded-full bg-accent/90 px-3 py-1 font-(family-name:--font-mono) text-[10px] font-semibold tracking-wider text-bg uppercase">
                Featured
              </span>
            )}
          </div>
        </div>
        <div className="relative p-4 sm:p-5">
          <h3 className="font-(family-name:--font-display) text-xl font-medium text-text-primary transition-colors duration-300 group-hover:text-accent">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-text-secondary leading-relaxed">
            {description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <span
            className="absolute right-5 bottom-5 translate-x-[-8px] text-sm text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:rotate-[-45deg] group-hover:opacity-100"
            aria-hidden="true"
          >
            &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

function HorizontalProjectCard({
  title,
  slug,
  description,
  image,
  tags,
  featured,
}: {
  title: string
  slug: string
  description: string
  image: string
  tags: string[]
  featured?: boolean
}) {
  return (
    <div className="w-[60vw] max-w-[800px] flex-shrink-0">
      <Link
        href={`/projects/${slug}`}
        className="card-shine group block overflow-hidden rounded-lg border border-border bg-bg-surface transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(206,121,107,0.08)]"
        data-cursor="interactive"
      >
        <div className="overflow-hidden">
          <div className="relative aspect-[16/9]">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.7]"
              sizes="60vw"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-surface/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            {featured && (
              <span className="absolute top-3 right-3 rounded-full bg-accent/90 px-3 py-1 font-(family-name:--font-mono) text-[10px] font-semibold tracking-wider text-bg uppercase">
                Featured
              </span>
            )}
          </div>
        </div>
        <div className="relative p-5 sm:p-6">
          <h3 className="font-(family-name:--font-display) text-2xl font-medium text-text-primary transition-colors duration-300 group-hover:text-accent">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-text-secondary leading-relaxed">
            {description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <span
            className="absolute right-6 bottom-6 translate-x-[-8px] text-sm text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:rotate-[-45deg] group-hover:opacity-100"
            aria-hidden="true"
          >
            &rarr;
          </span>
        </div>
      </Link>
    </div>
  )
}

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const scrollProgress = useMotionValue(0)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    if (!isDesktop) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: { revert: () => void } | undefined

    async function initGsap() {
      const gsapModule = await import('gsap')
      const scrollTriggerModule = await import('gsap/ScrollTrigger')
      const gsap = gsapModule.default
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger

      gsap.registerPlugin(ScrollTrigger)

      const track = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return

      ctx = gsap.context(() => {
        const totalWidth = track.scrollWidth
        const viewportWidth = window.innerWidth

        gsap.to(track, {
          x: -(totalWidth - viewportWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              scrollProgress.set(self.progress)
            },
          },
        })
      })
    }

    initGsap()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [isDesktop, scrollProgress])

  if (isDesktop) {
    return (
      <section id="projects">
        <div ref={sectionRef} className="relative">
          <div className="flex h-screen items-center overflow-hidden">
            <div className="absolute top-20 left-8 z-10">
              <h2 className="font-(family-name:--font-display) text-3xl font-bold text-text-primary">
                Projects
              </h2>
              <div
                className="mt-2 h-[3px] w-[120px] rounded-full bg-gradient-to-r from-accent to-accent/0"
                aria-hidden="true"
              />
              <motion.div
                className="mt-3 h-0.5 w-24 origin-left bg-accent/60"
                style={{ scaleX: scrollProgress }}
                aria-hidden="true"
              />
            </div>

            <div
              ref={trackRef}
              className="flex gap-10 pl-[5vw] pt-16"
            >
              {projects.map((project) => (
                <HorizontalProjectCard key={project.slug} {...project} />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="px-5 py-20 sm:px-6 lg:px-8 lg:py-32">
      <motion.div
        className="mx-auto max-w-[1120px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
      >
        <motion.div variants={scrollFadeUp} className="mb-10">
          <h2 className="font-(family-name:--font-display) text-3xl font-bold text-text-primary">
            Projects
          </h2>
          <div
            className="mt-2 h-[3px] w-[120px] rounded-full bg-gradient-to-r from-accent to-accent/0"
            aria-hidden="true"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-8"
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
          {projects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
