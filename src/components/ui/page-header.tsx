import { Reveal } from '@/components/ui/reveal'

interface PageHeaderProps {
  eyebrow: string
  title: React.ReactNode
  lead?: string
  annotation?: string
}

/**
 * The masthead every sub-page opens with, so /experience, /playground and
 * /blog read as chapters of one publication rather than three templates.
 */
export function PageHeader({ eyebrow, title, lead, annotation }: PageHeaderProps) {
  return (
    <header className="gutter mx-auto max-w-[1440px] pt-8 lg:pt-12">
      <div className="rule flex items-baseline justify-between gap-4 pt-3">
        <p className="meta text-text-tertiary">{eyebrow}</p>
        {annotation && <p className="meta numeral text-text-tertiary">{annotation}</p>}
      </div>

      <Reveal immediate className="mt-10 lg:mt-14">
        <h1 className="max-w-[18ch] font-(family-name:--font-display) text-3xl font-bold leading-[0.98] tracking-[-0.04em]">
          {title}
        </h1>
        {lead && (
          <p className="mt-5 max-w-[58ch] text-lg text-text-secondary">{lead}</p>
        )}
      </Reveal>
    </header>
  )
}
