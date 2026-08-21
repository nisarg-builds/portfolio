import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'
import { EXPERIMENTS } from '@/lib/site-data'
import { PageHeader } from '@/components/ui/page-header'
import { SectionMarker } from '@/components/ui/section-marker'
import { Reveal } from '@/components/ui/reveal'

const title = 'Playground'
const description =
  'Experiments and side builds — an AI nutrition tracker, algorithm visualizers, and generative drawing.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${SITE_CONFIG.name}`,
    description,
    url: `${SITE_CONFIG.url}/playground`,
    type: 'website',
  },
  twitter: { card: 'summary', title: `${title} | ${SITE_CONFIG.name}`, description },
  alternates: { canonical: `${SITE_CONFIG.url}/playground` },
}

const STATUS_LABEL = {
  live: 'Live',
  'in-progress': 'In progress',
  planned: 'Planned',
} as const

function Row({
  experiment,
  index,
}: {
  experiment: (typeof EXPERIMENTS)[number]
  index: number
}) {
  const content = (
    <>
      <div className="flex items-baseline gap-4 lg:col-span-5">
        <span className="numeral text-[0.6875rem] text-text-tertiary" aria-hidden="true">
          E-{String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="font-(family-name:--font-display) text-2xl font-medium tracking-[-0.03em] text-text-primary transition-transform duration-500 ease-out group-hover:translate-x-1.5">
          {experiment.title}
        </h2>
      </div>

      <p className="max-w-[56ch] text-base text-text-secondary lg:col-span-5">
        {experiment.description}
      </p>

      <div className="flex items-center gap-3 lg:col-span-2 lg:justify-end">
        <span
          className={
            experiment.status === 'live'
              ? 'meta text-accent'
              : 'meta text-text-tertiary'
          }
        >
          {STATUS_LABEL[experiment.status]}
        </span>
        {experiment.href && (
          <span
            className="text-text-tertiary transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            aria-hidden="true"
          >
            &#8599;
          </span>
        )}
      </div>
    </>
  )

  const className =
    'group grid gap-3 py-7 lg:grid-cols-12 lg:items-baseline lg:gap-8 lg:py-9'

  if (!experiment.href) {
    return <div className={className}>{content}</div>
  }

  if (experiment.external) {
    return (
      <a
        href={experiment.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-cursor="interactive"
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={experiment.href} className={className} data-cursor="interactive">
      {content}
    </Link>
  )
}

export default function PlaygroundPage() {
  return (
    <div className="pb-20 lg:pb-28">
      <PageHeader
        eyebrow="Playground"
        annotation={String(EXPERIMENTS.length).padStart(2, '0')}
        title={
          <>
            Small bets, built to find out <span className="emph">whether they work.</span>
          </>
        }
        lead="Side projects with a shorter leash than the ones in Selected Work. Some ship, some stay half-finished, all of them teach something."
      />

      <section className="gutter mx-auto mt-16 max-w-[1440px] lg:mt-24">
        <SectionMarker number="01" label="The experiment log" />

        <ol className="mt-6 border-b border-(--color-line) lg:mt-8">
          {EXPERIMENTS.map((experiment, i) => (
            <Reveal
              as="li"
              key={experiment.title}
              index={i}
              className="border-t border-(--color-line)"
            >
              <Row experiment={experiment} index={i} />
            </Reveal>
          ))}
        </ol>
      </section>
    </div>
  )
}
