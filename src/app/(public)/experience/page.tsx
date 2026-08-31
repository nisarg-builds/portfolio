import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'
import { EXPERIENCE } from '@/lib/site-data'
import { PageHeader } from '@/components/ui/page-header'
import { SectionMarker } from '@/components/ui/section-marker'
import { Reveal } from '@/components/ui/reveal'

const title = 'Experience'
const description =
  'Nisarg Chaudhary — Developer I at Vendasta, building AI automation and listing data infrastructure in Go, gRPC and Temporal.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_CONFIG.url}/experience`,
    type: 'website',
  },
  twitter: { card: 'summary', title, description },
  alternates: { canonical: `${SITE_CONFIG.url}/experience` },
}

export default function ExperiencePage() {
  return (
    <div className="pb-20 lg:pb-28">
      <PageHeader
        eyebrow="Experience"
        annotation="2025 — Present"
        title={
          <>
            Building the parts that are <span className="emph">supposed to be boring.</span>
          </>
        }
        lead={EXPERIENCE.summary}
      />

      {/* The role, stated the way a masthead states its publisher. */}
      <section className="gutter mx-auto mt-16 max-w-[1440px] lg:mt-24">
        <Reveal className="rule grid gap-6 pt-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="font-(family-name:--font-display) text-2xl font-bold tracking-[-0.035em]">
              {EXPERIENCE.company}
            </h2>
            <p className="mt-1 text-lg text-accent">{EXPERIENCE.title}</p>
          </div>
          <div className="lg:col-span-7 lg:pt-1.5">
            <p className="meta text-text-tertiary">
              {EXPERIENCE.period}
              <span className="px-2 opacity-40" aria-hidden="true">
                /
              </span>
              {EXPERIENCE.location}
            </p>
          </div>
        </Reveal>

        {/* Figures, set as a rule-divided row rather than four boxes. */}
        <Reveal delay={0.08} className="mt-12">
          <dl className="grid grid-cols-2 border-t border-(--color-line) sm:grid-cols-4">
            {EXPERIENCE.stats.map((stat) => (
              <div
                key={stat.label}
                className="border-b border-(--color-line) py-6 pr-4 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:pl-6 sm:first:pl-0"
              >
                <dt className="meta text-text-tertiary">{stat.label}</dt>
                <dd className="numeral mt-2 text-2xl text-text-primary">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* What he actually shipped. */}
      <section className="gutter mx-auto mt-20 max-w-[1440px] lg:mt-28">
        <SectionMarker
          number="01"
          label="What I shipped"
          annotation={String(EXPERIENCE.contributions.length).padStart(2, '0')}
        />

        <ol className="mt-10 border-b border-(--color-line) lg:mt-14">
          {EXPERIENCE.contributions.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              index={i}
              className="grid gap-3 border-t border-(--color-line) py-7 lg:grid-cols-12 lg:gap-8 lg:py-9"
            >
              <div className="flex items-baseline gap-4 lg:col-span-5">
                <span className="numeral text-[0.6875rem] text-accent" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-(family-name:--font-display) text-xl font-medium tracking-[-0.025em] text-text-primary">
                  {item.title}
                </h3>
              </div>
              <p className="max-w-[62ch] text-base text-text-secondary lg:col-span-7">
                {item.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Stack. */}
      <section className="gutter mx-auto mt-20 max-w-[1440px] lg:mt-28">
        <SectionMarker number="02" label="Stack" />
        <Reveal className="mt-8 flex flex-wrap gap-x-8 gap-y-4 lg:mt-10">
          {EXPERIENCE.stack.map((tool) => (
            <span
              key={tool}
              className="font-(family-name:--font-display) text-xl font-medium tracking-[-0.02em] text-text-secondary"
            >
              {tool}
            </span>
          ))}
        </Reveal>
      </section>

      {/* Closing line. */}
      <Reveal className="gutter mx-auto mt-24 max-w-[1440px] lg:mt-32">
        <blockquote className="rule max-w-[34ch] pt-6">
          <p className="font-(family-name:--font-display) text-2xl font-medium leading-[1.15] tracking-[-0.03em] text-text-primary">
            Great software gets built where engineering rigour meets{' '}
            <span className="emph">genuine care</span> for whoever has to use it.
          </p>
        </blockquote>
      </Reveal>
    </div>
  )
}
