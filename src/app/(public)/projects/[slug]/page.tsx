import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProjects, getProjectBySlug, getProjectSlugs } from '@/lib/firebase/projects'
import { SITE_CONFIG } from '@/lib/constants'
import { SectionMarker } from '@/components/ui/section-marker'
import { ProjectLogo } from '@/components/ui/project-logo'
import { Reveal } from '@/components/ui/reveal'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}

  const url = `${SITE_CONFIG.url}/projects/${slug}`
  const image = project.image || `${SITE_CONFIG.url}/og-image.png`

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url,
      type: 'article',
      images: [{ url: image, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [image],
    },
    alternates: { canonical: url },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [project, projects] = await Promise.all([getProjectBySlug(slug), getProjects()])
  if (!project) notFound()

  const index = projects.findIndex((entry) => entry.slug === slug)
  const previous = index > 0 ? projects[index - 1] : null
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : null
  const plates = project.screenshots.filter((src) => src !== project.image)
  // An internal link is the running app; an external one is the source.
  const isInternalLink = project.link.startsWith('/')
  const buttonClasses =
    'meta group inline-flex items-center gap-2 border border-(--color-line) px-4 py-2.5 text-text-primary transition-colors duration-200 hover:border-accent hover:text-accent'

  return (
    <article className="pb-20 lg:pb-28">
      <div className="gutter mx-auto max-w-[1440px] pt-8 lg:pt-12">
        <Link
          href="/#projects"
          className="meta group inline-flex items-center gap-2 text-text-tertiary transition-colors duration-200 hover:text-accent"
          data-cursor="interactive"
        >
          <span
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
            aria-hidden="true"
          >
            &#8592;
          </span>
          Selected work
        </Link>

        <div className="rule mt-8 flex items-baseline justify-between gap-4 pt-3">
          <p className="meta text-text-tertiary">
            {index >= 0 && (
              <span className="numeral text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
            <span className="px-2 opacity-40" aria-hidden="true">
              /
            </span>
            Project
          </p>
          {project.year && <p className="meta numeral text-text-tertiary">{project.year}</p>}
        </div>

        {/* Title block */}
        <Reveal immediate className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="font-(family-name:--font-display) text-3xl font-bold leading-[0.98] tracking-[-0.04em]">
              {project.logo && <ProjectLogo src={project.logo} />}
              {project.title}
            </h1>
            {project.role && <p className="mt-3 text-lg text-accent">{project.role}</p>}
          </div>
          <p className="max-w-[52ch] text-lg text-text-secondary lg:col-span-5 lg:pt-2">
            {project.description}
          </p>
        </Reveal>
      </div>

      {/*
        Lead plate. Every image shows whole, at its own shape, on a mat: a phone
        screenshot is tall and a web one is wide, and a fixed frame crops one of
        them. ponytail: no stored image size, so width/height are 0 and the mat
        sizes itself on load. Store the size at upload if layout shift matters.
      */}
      {project.image && (
        <Reveal className="gutter mx-auto mt-12 max-w-[1440px] lg:mt-16">
          <div className="border border-(--color-line) bg-bg-surface p-4 sm:p-6">
            <Image
              src={project.image}
              alt={`${project.title} — main view`}
              width={0}
              height={0}
              className="block h-auto max-h-[min(75vh,720px)] w-full object-contain"
              sizes="(max-width: 1440px) 100vw, 1440px"
              priority
            />
          </div>
        </Reveal>
      )}

      {/* Body */}
      <div className="gutter mx-auto mt-16 max-w-[1440px] lg:mt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <p className="meta rule pt-2.5 text-text-tertiary">The story</p>
            <p className="mt-6 max-w-[68ch] text-base leading-[1.75] text-text-secondary" data-cursor="text">
              {project.fullDescription}
            </p>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-4 lg:col-start-9">
            <p className="meta rule pt-2.5 text-text-tertiary">Built with</p>
            <ul className="mt-4">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="border-b border-(--color-line-soft) py-2.5 text-sm text-text-secondary"
                >
                  {tag}
                </li>
              ))}
            </ul>

            {(project.download || project.link) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {project.download && (
                  <a
                    href={project.download}
                    download
                    className={buttonClasses}
                    data-cursor="interactive"
                  >
                    Download
                    <span
                      className="transition-transform duration-300 group-hover:translate-y-0.5"
                      aria-hidden="true"
                    >
                      &#8595;
                    </span>
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target={isInternalLink ? undefined : '_blank'}
                    rel={isInternalLink ? undefined : 'noopener noreferrer'}
                    className={buttonClasses}
                    data-cursor="interactive"
                  >
                    {isInternalLink ? 'Open the app' : 'View source'}
                    <span
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      &#8599;
                    </span>
                  </a>
                )}
              </div>
            )}
            {/* An unnotarized Mac app is blocked on first open. Without this, most visitors stop there. */}
            {project.download?.endsWith('.dmg') && (
              <p className="mt-3 max-w-[40ch] text-sm text-text-tertiary">
                macOS blocks the app the first time you open it. Open System Settings, then
                Privacy &amp; Security, and click Open Anyway.
              </p>
            )}
          </Reveal>
        </div>
      </div>

      {/* Plates */}
      {plates.length > 0 && (
        <section className="gutter mx-auto mt-20 max-w-[1440px] lg:mt-28">
          <SectionMarker
            number="02"
            label="Plates"
            annotation={String(plates.length).padStart(2, '0')}
          />
          <div className="mt-10 grid items-start gap-8 sm:grid-cols-2 lg:mt-14">
            {plates.map((src, i) => (
              <Reveal as="figure" key={src} index={i}>
                <div className="border border-(--color-line) bg-bg-surface p-4 sm:p-6">
                  <Image
                    src={src}
                    alt={`${project.title} — view ${i + 2}`}
                    width={0}
                    height={0}
                    className="block h-auto max-h-[min(70vh,640px)] w-full object-contain"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="meta mt-2.5 text-text-tertiary">
                  <span className="numeral text-accent">
                    Fig. {String(i + 2).padStart(2, '0')}
                  </span>
                  <span className="px-2 opacity-40" aria-hidden="true">
                    /
                  </span>
                  {project.title}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Prev / next */}
      <nav
        aria-label="More projects"
        className="gutter mx-auto mt-20 max-w-[1440px] lg:mt-28"
      >
        <div className="rule grid gap-6 pt-6 sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/projects/${previous.slug}`}
              className="group"
              data-cursor="interactive"
            >
              <span className="meta text-text-tertiary">&#8592; Previous</span>
              <span className="mt-2 block font-(family-name:--font-display) text-xl font-medium tracking-[-0.025em] text-text-primary transition-colors duration-200 group-hover:text-accent">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="group sm:text-right"
              data-cursor="interactive"
            >
              <span className="meta text-text-tertiary">Next &#8594;</span>
              <span className="mt-2 block font-(family-name:--font-display) text-xl font-medium tracking-[-0.025em] text-text-primary transition-colors duration-200 group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </article>
  )
}
