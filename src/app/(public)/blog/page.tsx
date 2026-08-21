import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'
import { PLANNED_WRITING } from '@/lib/site-data'
import { PageHeader } from '@/components/ui/page-header'
import { SectionMarker } from '@/components/ui/section-marker'
import { Reveal } from '@/components/ui/reveal'

const title = 'Blog'
const description =
  'Writing on backend systems, AI tooling, and the overlap between drawing and interface design.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${SITE_CONFIG.name}`,
    description,
    url: `${SITE_CONFIG.url}/blog`,
    type: 'website',
  },
  twitter: { card: 'summary', title: `${title} | ${SITE_CONFIG.name}`, description },
  alternates: { canonical: `${SITE_CONFIG.url}/blog` },
}

export default function BlogPage() {
  return (
    <div className="pb-20 lg:pb-28">
      <PageHeader
        eyebrow="Blog"
        annotation="In draft"
        title={
          <>
            Nothing published yet — but here is <span className="emph">what is on the desk.</span>
          </>
        }
        lead="I would rather show the outline than post a placeholder. These are the pieces I am actually drafting, drawn from work I have shipped."
      />

      <section className="gutter mx-auto mt-16 max-w-[1440px] lg:mt-24">
        <SectionMarker
          number="01"
          label="In progress"
          annotation={String(PLANNED_WRITING.length).padStart(2, '0')}
        />

        <ol className="mt-10 border-b border-(--color-line) lg:mt-14">
          {PLANNED_WRITING.map((post, i) => (
            <Reveal
              as="li"
              key={post.title}
              index={i}
              className="grid gap-3 border-t border-(--color-line) py-7 lg:grid-cols-12 lg:gap-8 lg:py-9"
            >
              <div className="flex items-baseline gap-4 lg:col-span-6">
                <span className="numeral text-[0.6875rem] text-text-tertiary" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="max-w-[26ch] font-(family-name:--font-display) text-xl font-medium leading-[1.15] tracking-[-0.025em] text-text-primary">
                  {post.title}
                </h2>
              </div>
              <p className="max-w-[58ch] text-base text-text-secondary lg:col-span-5">
                {post.summary}
              </p>
              <p className="meta text-accent lg:col-span-1 lg:text-right">{post.topic}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.1} className="mt-10">
          <p className="meta text-text-tertiary">
            Drafts land here as they finish. No newsletter, no schedule.
          </p>
        </Reveal>
      </section>
    </div>
  )
}
