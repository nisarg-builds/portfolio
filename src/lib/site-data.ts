/**
 * Single source of truth for everything the site says about Nisarg.
 *
 * Copy lives here rather than inline in components so the voice stays
 * consistent, and so a content edit never requires touching layout code.
 */

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Contribution {
  title: string
  description: string
}

export interface Experiment {
  title: string
  description: string
  status: 'live' | 'in-progress' | 'planned'
  href?: string
  external?: boolean
}

export const PROFILE = {
  name: 'Nisarg Chaudhary',
  firstName: 'Nisarg',
  /** Split for the two-line masthead in the hero. */
  nameLines: ['Nisarg', 'Chaudhary'] as const,
  role: 'Software Engineer',
  company: 'Vendasta',
  location: 'Saskatoon, SK',
  timeZone: 'America/Regina',
  study: 'CS Honours + Studio Arts',
  university: 'University of Saskatchewan',

  /** The one line that has to work. Everything else supports it. */
  tagline: 'I build the systems, and draw the rest by hand.',

  lead:
    'Software engineer at Vendasta, working on AI-powered automation and listing data infrastructure in Go, gRPC and Temporal. Computer Science Honours with a Studio Arts minor at the University of Saskatchewan.',

  bio: [
    "I'm a Computer Science Honours student at the University of Saskatchewan, minoring in Studio Arts. I moved from India to Canada to chase the part of technology that felt like making things, not just shipping them.",
    'At Vendasta I work on AI-powered automation and listing data infrastructure — Go services, gRPC, Temporal workflows, and the agent tooling that sits on top of them. The work I like best is the kind where a brittle system goes quiet and stays that way.',
    "The Studio Arts minor isn't a detour. Drawing taught me composition, restraint, and how long the last ten percent takes — which turns out to be most of what design is. This site is where both halves live.",
  ],

  availability: 'Open to conversations about backend systems and design engineering.',
} as const

/**
 * Deliberately does not enumerate the projects or state a count: the list is
 * Firestore-driven, so any copy that describes its contents goes stale the
 * first time a project is added or removed from the admin panel.
 */
export const WORK_INTRO =
  'Products and coursework, newest first. Each one is here for what it taught me, not for how it photographs.'

export const SKILL_GROUPS: SkillGroup[] = [
  { label: 'Languages', items: ['TypeScript', 'Go', 'Python', 'Java', 'C', 'SQL'] },
  {
    label: 'Interface',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Figma'],
  },
  {
    label: 'Systems & data',
    items: ['gRPC', 'Temporal', 'Node.js', 'PostgreSQL', 'MongoDB', 'Elasticsearch'],
  },
  { label: 'Platform', items: ['Docker', 'Google Cloud', 'Git', 'CI/CD'] },
]

export const EXPERIENCE = {
  company: 'Vendasta',
  title: 'Developer I',
  period: 'May 2025 — Present',
  location: 'Saskatoon, SK',
  summary:
    'I build AI-powered automation and data infrastructure underneath a platform used by thousands of businesses — Go services, real-time pipelines, and the agent tooling that drives them. The through-line is removing manual work without adding fragility.',
  stack: [
    'Go',
    'gRPC',
    'Temporal',
    'Python',
    'MCP Tools',
    'Elasticsearch',
    'Docker',
    'Google Cloud',
  ],
  stats: [
    { value: '8+', label: 'Repositories' },
    { value: '50+', label: 'PRs merged' },
    { value: '3', label: 'RFCs authored' },
    { value: '1yr', label: 'In role' },
  ],
  contributions: [
    {
      title: 'AI-powered business profile automation',
      description:
        'Designed and shipped an end-to-end system where AI agents detect incomplete business profiles, generate optimized content, and publish updates live. Authored the RFC, built the tool definitions, and wrote the technical guides the team now works from.',
    },
    {
      title: 'Listing data infrastructure & reliability',
      description:
        'Led the migration from brittle web scraping to API-based collection, ending recurring outages and improving accuracy across thousands of business listings. Extended geolocation sync for Apple and Google and automated real-time syndication.',
    },
    {
      title: 'AI capabilities & developer tooling',
      description:
        'Built MCP tools and prompt modules that let AI agents diagnose listing score changes and surface actionable insights, and enriched business embeddings with structured attribute data for better retrieval.',
    },
    {
      title: 'Platform reliability across services',
      description:
        'Shipped targeted fixes across gRPC services and data pipelines — address parsing bugs, legacy activation conflicts, and broader product tier coverage — measurably reducing support escalations.',
    },
  ] satisfies Contribution[],
} as const

/**
 * Side builds. FitGlass used to live here; it graduated to Selected Work once
 * it became a real product, and listing it in both places would only make the
 * site look bigger than it is.
 */
export const EXPERIMENTS: Experiment[] = [
  {
    title: 'Pathfinding Visualizer',
    description:
      'A*, BFS and Dijkstra racing across a grid of barriers so you can watch how differently they think.',
    status: 'live',
    href: 'https://github.com/nisarg-11-here/Pathfinding_Visualizer',
    external: true,
  },
  {
    title: 'Generative Drawing',
    description:
      'Procedural line work — plotter-style compositions built from the same rules I use with a real pen.',
    status: 'in-progress',
  },
]

export interface PlannedPost {
  title: string
  summary: string
  topic: string
}

/**
 * The blog has no posts yet. Rather than a "coming soon" placeholder, the
 * page publishes what is actually on the desk — which reads as intent instead
 * of emptiness, and gives the section a reason to exist before it has content.
 */
export const PLANNED_WRITING: PlannedPost[] = [
  {
    title: 'Replacing a scraper with an API, without a big-bang migration',
    summary:
      'What it actually takes to retire a brittle data source under live traffic: shadow reads, disagreement logging, and deciding which differences are bugs and which are the old system being wrong.',
    topic: 'Systems',
  },
  {
    title: 'Giving an AI agent tools worth calling',
    summary:
      'Most agent failures I have debugged were not model failures — they were tool definitions that described what a function did instead of when to reach for it.',
    topic: 'AI',
  },
  {
    title: 'Durable execution changed how I write background work',
    summary:
      'Notes on moving jobs into Temporal, and why "what happens if this dies halfway" stopped being a design conversation and started being a default.',
    topic: 'Systems',
  },
  {
    title: 'What life drawing taught me about interface design',
    summary:
      'Gesture before detail, construction before rendering, and the fact that most of the work is deciding what to leave out. Both disciplines punish the same instinct.',
    topic: 'Design',
  },
]

/** Colophon. A designed page should say how it was made. */
export const COLOPHON = {
  built: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  setIn: ['Space Grotesk', 'DM Sans', 'JetBrains Mono'],
} as const
