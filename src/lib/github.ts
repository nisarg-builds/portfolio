import 'server-only'
import { GITHUB_HANDLE } from '@/lib/constants'

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  /** ISO date, e.g. "2026-04-08". */
  date: string
  count: number
  level: ContributionLevel
}

export interface ContributionCalendar {
  total: number
  /** True when the total includes private work that GitHub shows only as counts. */
  includesPrivate: boolean
  /** Sunday-first weeks, oldest first. The last week is partial. */
  weeks: ContributionDay[][]
}

export interface MonthLabel {
  /** Zero-based week column the label starts on. */
  column: number
  label: string
}

export interface MonthTotal {
  /** "YYYY-MM" */
  month: string
  count: number
}

const ENDPOINT = 'https://api.github.com/graphql'
const TIMEOUT_MS = 5_000

const QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`

/** GitHub's own quartiles, so the grid shades exactly like the profile. */
const LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Week columns a month label needs before the next label or the grid edge. */
const LABEL_COLUMNS = 3

interface GraphQLResponse {
  data?: {
    user: {
      contributionsCollection: {
        restrictedContributionsCount: number
        contributionCalendar: {
          totalContributions: number
          weeks: {
            contributionDays: { date: string; contributionCount: number; contributionLevel: string }[]
          }[]
        }
      }
    } | null
  }
  errors?: { message: string }[]
}

/**
 * The contribution calendar from the GitHub profile, for the last year.
 *
 * Returns null, and the figure does not render, when there is no token or
 * GitHub fails. A snapshot would misstate current activity, so there is
 * deliberately no static fallback.
 */
export async function getContributions(): Promise<ContributionCalendar | null> {
  const token = process.env.GITHUB_TOKEN
  // Unset is the normal state for local dev and preview deploys, not an error.
  if (!token) return null

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_HANDLE } }),
      // Bounds the first build and every ISR regeneration. A later build that
      // refetches its stale build cache drops this signal (Next.js 16), so a
      // hang there waits for Next's own page timeout instead.
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`GitHub responded ${response.status}`)

    const { data, errors } = (await response.json()) as GraphQLResponse
    if (errors?.length) throw new Error(errors.map((error) => error.message).join('. '))

    const collection = data?.user?.contributionsCollection
    if (!collection) throw new Error(`No contributions for "${GITHUB_HANDLE}"`)

    const { totalContributions, weeks } = collection.contributionCalendar
    return {
      total: totalContributions,
      includesPrivate: collection.restrictedContributionsCount > 0,
      weeks: weeks
        .map((week) =>
          week.contributionDays.map((day) => ({
            date: day.date,
            count: day.contributionCount,
            level: LEVELS[day.contributionLevel] ?? 0,
          })),
        )
        // The month labels read each week's first day.
        .filter((week) => week.length > 0),
    }
  } catch (error) {
    console.error('[github] Contribution read failed, hiding the graph:', error)
    return null
  }
}

/**
 * Month names over the week columns, on the first week of each month the way
 * GitHub places them. A label without room before the next label or the grid
 * edge is dropped, so labels never collide or overflow.
 */
export function monthLabels(weeks: ContributionDay[][]): MonthLabel[] {
  const starts = weeks.flatMap((week, column) => {
    const month = week[0].date.slice(0, 7)
    if (column > 0 && weeks[column - 1][0].date.slice(0, 7) === month) return []
    return [{ column, label: MONTHS[Number(month.slice(5)) - 1] }]
  })
  return starts.filter(
    (start, i) => (starts[i + 1]?.column ?? weeks.length) - start.column >= LABEL_COLUMNS,
  )
}

/** Contributions summed by calendar month, oldest first: the table twin of the grid. */
export function monthlyTotals(weeks: ContributionDay[][]): MonthTotal[] {
  const totals = new Map<string, number>()
  for (const day of weeks.flat()) {
    const month = day.date.slice(0, 7)
    totals.set(month, (totals.get(month) ?? 0) + day.count)
  }
  return Array.from(totals, ([month, count]) => ({ month, count }))
}
