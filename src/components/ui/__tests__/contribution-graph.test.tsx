import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ContributionCalendar } from '@/lib/github'

// The real package throws outside a React Server environment.
vi.mock('server-only', () => ({}))

import { ContributionGraph } from '../contribution-graph'

const calendar: ContributionCalendar = {
  total: 13,
  includesPrivate: false,
  // A short first week. Jan 1, 2026 is a Thursday.
  weeks: [
    [
      { date: '2026-01-01', count: 0, level: 0 },
      { date: '2026-01-02', count: 1, level: 1 },
      { date: '2026-01-03', count: 12, level: 4 },
    ],
  ],
}

describe('ContributionGraph', () => {
  it('claims private work only when GitHub reports it', () => {
    const publicOnly = renderToStaticMarkup(<ContributionGraph calendar={calendar} />)
    const withPrivate = renderToStaticMarkup(
      <ContributionGraph calendar={{ ...calendar, includesPrivate: true }} />,
    )

    expect(publicOnly).not.toContain('including private work')
    expect(withPrivate).toContain('including private work')
  })

  it('gives each day a tooltip with its count', () => {
    const html = renderToStaticMarkup(<ContributionGraph calendar={calendar} />)

    expect(html).toContain('title="No contributions on Jan 1, 2026"')
    expect(html).toContain('title="1 contribution on Jan 2, 2026"')
    expect(html).toContain('title="12 contributions on Jan 3, 2026"')
  })

  it('pads a short first week so each day sits on its weekday row', () => {
    const html = renderToStaticMarkup(<ContributionGraph calendar={calendar} />)

    // Sunday to Wednesday are blank, so Thursday lands on the fifth row.
    expect(html).toMatch(/(<span><\/span>){4}<span title="No contributions on Jan 1, 2026"/)
  })
})
