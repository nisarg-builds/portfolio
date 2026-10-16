import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { SOCIAL_LINKS } from '@/lib/constants'
import { ACTIVITY } from '@/lib/site-data'
import {
  monthLabels,
  monthlyTotals,
  type ContributionCalendar,
  type ContributionLevel,
} from '@/lib/github'
import { Reveal } from '@/components/ui/reveal'

/** Static class names, one per GitHub level, so Tailwind can see them. */
const LEVEL_CLASS: Record<ContributionLevel, string> = {
  0: 'bg-bg-elevated',
  1: 'bg-heat-1',
  2: 'bg-heat-2',
  3: 'bg-heat-3',
  4: 'bg-heat-4',
}

const LEVELS = [0, 1, 2, 3, 4] as const

const dayFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const monthFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function describeDay(date: string, count: number) {
  const day = dayFormat.format(new Date(`${date}T00:00:00Z`))
  if (count === 0) return `No contributions on ${day}`
  return `${count} ${count === 1 ? 'contribution' : 'contributions'} on ${day}`
}

interface ContributionGraphProps {
  calendar: ContributionCalendar
  className?: string
}

/**
 * Fig. 02: a year of GitHub activity, one square per day, on the same 4/8
 * split as the About section above it.
 *
 * Rendered entirely on the server. Each day carries a native tooltip. The
 * grid and its month labels are hidden from assistive tech, and a visually
 * hidden table of monthly totals stands in for them.
 */
export function ContributionGraph({ calendar, className }: ContributionGraphProps) {
  const { total, includesPrivate, weeks } = calendar
  const columns: CSSProperties = {
    gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
  }
  // GitHub has always opened on a full week, but nothing documents it. Pad a
  // short first week so every day still lands on its weekday row.
  const leadingBlanks = 7 - (weeks[0]?.length ?? 7)

  return (
    <Reveal className={cn('grid gap-8 lg:grid-cols-12 lg:gap-14', className)}>
      <div className="lg:col-span-4">
        <p className="numeral text-2xl text-text-primary">{total.toLocaleString('en-US')}</p>
        <p className="mt-3 max-w-[30ch] text-base text-text-secondary" data-cursor="text">
          {includesPrivate ? ACTIVITY.leadWithPrivate : ACTIVITY.lead}
        </p>
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="meta link-underline mt-5 inline-block text-text-secondary transition-colors duration-200 hover:text-accent"
          data-cursor="interactive"
        >
          {ACTIVITY.linkLabel} <span aria-hidden="true">&#8599;</span>
        </a>
      </div>

      <figure className="lg:col-span-8">
        <div
          className="meta mb-2 hidden gap-x-[3px] text-text-tertiary sm:grid"
          style={columns}
          aria-hidden="true"
        >
          {monthLabels(weeks).map(({ column, label }) => (
            <span key={column} className="whitespace-nowrap" style={{ gridColumnStart: column + 1 }}>
              {label}
            </span>
          ))}
        </div>

        <div
          className="grid grid-flow-col grid-rows-[repeat(7,auto)] gap-px sm:gap-[3px]"
          style={columns}
          aria-hidden="true"
        >
          {Array.from({ length: leadingBlanks }, (_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {weeks.flat().map((day) => (
            <span
              key={day.date}
              title={describeDay(day.date, day.count)}
              className={cn(
                'aspect-square hover:outline hover:outline-text-primary',
                LEVEL_CLASS[day.level],
              )}
            />
          ))}
        </div>

        <table className="sr-only">
          <caption>GitHub contributions by month</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Contributions</th>
            </tr>
          </thead>
          <tbody>
            {monthlyTotals(weeks).map(({ month, count }) => (
              <tr key={month}>
                <th scope="row">{monthFormat.format(new Date(`${month}-01T00:00:00Z`))}</th>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <figcaption className="meta rule mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-2.5 text-text-tertiary">
          <span>
            <span className="numeral text-accent">Fig. 02</span>
            <span className="px-2 opacity-40" aria-hidden="true">
              /
            </span>
            {ACTIVITY.caption}
          </span>
          <span className="flex items-center gap-1.5" aria-hidden="true">
            Less
            {LEVELS.map((level) => (
              <span key={level} className={cn('size-2.5', LEVEL_CLASS[level])} />
            ))}
            More
          </span>
        </figcaption>
      </figure>
    </Reveal>
  )
}
