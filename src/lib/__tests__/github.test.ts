import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// The real package throws outside a React Server environment.
vi.mock('server-only', () => ({}))

import { getContributions, monthLabels, monthlyTotals, type ContributionDay } from '../github'

function calendarResponse({ restricted = 0, level = 'FOURTH_QUARTILE' } = {}) {
  return {
    data: {
      user: {
        contributionsCollection: {
          restrictedContributionsCount: restricted,
          contributionCalendar: {
            totalContributions: 15,
            weeks: [
              {
                contributionDays: [
                  { date: '2026-09-27', contributionCount: 0, contributionLevel: 'NONE' },
                  { date: '2026-09-28', contributionCount: 3, contributionLevel: 'FIRST_QUARTILE' },
                  { date: '2026-09-29', contributionCount: 12, contributionLevel: level },
                ],
              },
              // Never seen from GitHub, but it would crash the page if it got through.
              { contributionDays: [] },
            ],
          },
        },
      },
    },
  }
}

function mockFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('getContributions', () => {
  beforeEach(() => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token')
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns null without calling GitHub when no token is set', async () => {
    vi.stubEnv('GITHUB_TOKEN', '')
    const fetchMock = mockFetch(calendarResponse())

    expect(await getContributions()).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
  })

  it('maps the calendar, drops empty weeks, and sends the token with a timeout', async () => {
    const fetchMock = mockFetch(calendarResponse())

    expect(await getContributions()).toEqual({
      total: 15,
      includesPrivate: false,
      weeks: [
        [
          { date: '2026-09-27', count: 0, level: 0 },
          { date: '2026-09-28', count: 3, level: 1 },
          { date: '2026-09-29', count: 12, level: 4 },
        ],
      ],
    })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.github.com/graphql')
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe('Bearer test-token')
    expect(init.signal).toBeInstanceOf(AbortSignal)
    expect(JSON.parse(init.body).variables).toEqual({ login: 'nisarg-11-here' })
  })

  it('flags private work when GitHub hides some contributions from the viewer', async () => {
    mockFetch(calendarResponse({ restricted: 604 }))

    expect((await getContributions())?.includesPrivate).toBe(true)
  })

  it('shades an unknown contribution level as empty instead of failing', async () => {
    mockFetch(calendarResponse({ level: 'FIFTH_QUARTILE' }))

    expect((await getContributions())?.weeks[0][2].level).toBe(0)
  })

  it.each([
    ['an expired or revoked token', () => mockFetch({ message: 'Bad credentials' }, 401)],
    ['GraphQL errors', () => mockFetch({ errors: [{ message: 'Something went wrong' }] })],
    ['a renamed or missing user', () => mockFetch({ data: { user: null } })],
    [
      'an unexpected shape',
      () => mockFetch({ data: { user: { contributionsCollection: { contributionCalendar: {} } } } }),
    ],
    [
      'a network failure or timeout',
      () =>
        vi.stubGlobal(
          'fetch',
          vi.fn().mockRejectedValue(new DOMException('The operation timed out.', 'TimeoutError')),
        ),
    ],
  ])('returns null and logs on %s', async (_case, arrange) => {
    arrange()

    expect(await getContributions()).toBeNull()
    expect(console.error).toHaveBeenCalled()
  })
})

function weeksStarting(sundays: string[]): ContributionDay[][] {
  return sundays.map((date) => [{ date, count: 0, level: 0 }])
}

describe('monthLabels', () => {
  it('labels the first week of each month', () => {
    const weeks = weeksStarting([
      '2026-01-04', '2026-01-11', '2026-01-18', '2026-01-25',
      '2026-02-01', '2026-02-08', '2026-02-15', '2026-02-22',
    ])

    expect(monthLabels(weeks)).toEqual([
      { column: 0, label: 'Jan' },
      { column: 4, label: 'Feb' },
    ])
  })

  it('drops a label that would collide with the next one or overflow the grid', () => {
    // GitHub opens the calendar on a Sunday, here one week before October.
    const weeks = weeksStarting([
      '2025-09-28', '2025-10-05', '2025-10-12', '2025-10-19',
      '2025-10-26', '2025-11-02', '2025-11-09',
    ])

    expect(monthLabels(weeks)).toEqual([{ column: 1, label: 'Oct' }])
  })
})

describe('monthlyTotals', () => {
  it('sums each calendar month, oldest first', () => {
    const weeks: ContributionDay[][] = [
      [
        { date: '2026-01-30', count: 2, level: 1 },
        { date: '2026-01-31', count: 5, level: 3 },
      ],
      [
        { date: '2026-02-01', count: 4, level: 2 },
        { date: '2026-02-02', count: 0, level: 0 },
      ],
    ]

    expect(monthlyTotals(weeks)).toEqual([
      { month: '2026-01', count: 7 },
      { month: '2026-02', count: 4 },
    ])
  })
})
