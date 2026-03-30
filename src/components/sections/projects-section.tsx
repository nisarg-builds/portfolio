'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { scrollFadeUp, easings } from '@/lib/easings'
import { projects } from '@/lib/projects'

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-sm border border-border bg-bg-elevated px-2.5 py-0.5 font-(family-name:--font-mono) text-xs text-text-secondary">
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
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3, ease: easings.easeOut },
      }}
      className={featured ? 'md:col-span-2' : ''}
    >
      <Link
        href={`/projects/${slug}`}
        className="group block overflow-hidden rounded-lg border border-border bg-bg-surface transition-[border-color,box-shadow] duration-300 hover:border-border-hover hover:shadow-card"
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
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={
                featured
                  ? '(max-width: 768px) 100vw, 80vw'
                  : '(max-width: 768px) 100vw, 40vw'
              }
            />
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-(family-name:--font-display) text-xl font-medium text-text-primary">
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
        </div>
      </Link>
    </motion.div>
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
      className="mt-2 max-w-[160px]"
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

export function ProjectsSection() {
  return (
    <section id="projects" className="px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
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
          <WavyLine />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
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
