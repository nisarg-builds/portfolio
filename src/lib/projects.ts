export interface Project {
  title: string
  slug: string
  description: string
  fullDescription: string
  tags: string[]
  image: string
  screenshots: string[]
  link: string
  featured: boolean
  role?: string
  /** Display year for the project index. Optional — omitted rows simply hide it. */
  year?: string
  order: number
}

/**
 * Static project data.
 *
 * Firestore is the system of record once credentials are configured, but the
 * site must never render an empty Projects section — not in local dev, not in
 * a preview deploy, and not if Firestore is briefly unreachable. These entries
 * mirror the seed script and act as the floor.
 */
export const FALLBACK_PROJECTS: Project[] = [
  {
    title: 'FitGlass',
    slug: 'fitglass',
    description:
      'AI nutrition tracking — photograph a meal and get a calorie and macro breakdown back, plus a chat assistant that knows your targets.',
    fullDescription:
      "A full product rather than a course project: onboarding that derives your calorie and macro targets from height, weight, activity level and goal; a camera-first log where a photo of a meal comes back as structured nutrition data; a chat assistant that answers with your own numbers in context; and a weekly view that shows the trend rather than a single day's guilt. Built end to end — data models, Firestore schema, the Claude vision pipeline, the state layer, and every screen. The hard part was not the model call. It was deciding what to do when the model is unsure, and making a wrong estimate cheap to correct instead of something you have to argue with.",
    tags: ['Next.js', 'TypeScript', 'Claude API', 'Firebase', 'Zustand'],
    image: '',
    screenshots: [],
    link: '/fitglass',
    featured: true,
    role: 'Solo build',
    year: '2026',
    order: 0,
  },
  {
    title: 'PCubed',
    slug: 'pcubed',
    description:
      'A cataloguing platform for projectile point artifacts, built with a twelve-person team running real software-management roles.',
    fullDescription:
      'A university project built with a team of twelve, each assigned a real software management role — Project Manager (me), Build Master, Dev and Test teams, Risk Officers, and Triage. We worked directly with a stakeholder to deliver the first phase of a web app he intended to keep developing: an interactive interface over a structured database catalogue of projectile point artifacts. Leading it taught me what actually holds a large team together — communication cadence and honest delivery estimates, when everyone has a different schedule and a different definition of "done".',
    tags: ['PostgreSQL', 'React', 'Material UI', 'Docker'],
    image: '/images/projects/pcubed-1.png',
    screenshots: [
      '/images/projects/pcubed-1.png',
      '/images/projects/pcubed-2.png',
      '/images/projects/pcubed-3.png',
      '/images/projects/pcubed-4.png',
      '/images/projects/pcubed-5.png',
    ],
    link: 'https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-4',
    featured: true,
    role: 'Project Manager',
    year: '2024',
    order: 1,
  },
  {
    title: 'Code Community',
    slug: 'code-community',
    description:
      'A Reddit-shaped forum for programmers — channels, topics, tag search, and memberships, built against a hard deadline.',
    fullDescription:
      'The largest project I have built in the shortest time. The brief for CMPT 353 was a pared-back Reddit clone; I shipped channels, topics nested underneath them, search across topics, channels and tags, and joinable communities, all on MySQL. Three words for it: learning, deadline, fun.',
    tags: ['React', 'Express', 'Node.js', 'MySQL', 'Bootstrap'],
    image: '/images/projects/code-community.png',
    screenshots: ['/images/projects/code-community.png'],
    link: 'https://git.cs.usask.ca/ujc862/project-353-the-code-community.git',
    featured: false,
    year: '2024',
    order: 2,
  },
  {
    title: 'Pathfinding Visualizer',
    slug: 'pathfinding-visualizer',
    description:
      'A*, BFS and Dijkstra rendered in real time, so you can watch how differently each one searches the same maze.',
    fullDescription:
      'A personal project from the summer of 2024, when I went looking for shortest-path algorithms and decided the fastest way to understand them was to watch them run. It visualizes the path each algorithm takes and every cell it considered on the way there, around barriers you place yourself. Building the visualizer taught me more about the algorithms than reading them ever did.',
    tags: ['Python', 'PyGame'],
    image: '/images/projects/pathfinding-4.png',
    screenshots: [
      '/images/projects/pathfinding-1.png',
      '/images/projects/pathfinding-2.png',
      '/images/projects/pathfinding-3.png',
      '/images/projects/pathfinding-4.png',
    ],
    link: 'https://github.com/nisarg-11-here/Pathfinding_Visualizer',
    featured: false,
    year: '2024',
    order: 3,
  },
  {
    title: 'Volunteer Connect',
    slug: 'volunteer-connect',
    description:
      'A platform pairing students with volunteer organizations — and the first team project where I stepped up to lead.',
    fullDescription:
      "My first group software project, and where I learned Agile-Scrum by doing it badly and then better. It made me comfortable working asynchronously with people I did not already know. The hardest and best part was learning new technology while deliverables were already due. It also taught me how much a team needs a leader — we started without one, felt the drift, and I took the role since the idea had been mine.",
    tags: ['MongoDB', 'React', 'Express', 'Docker'],
    image: '/images/projects/volunteer-connect-1.png',
    screenshots: [
      '/images/projects/volunteer-connect-1.png',
      '/images/projects/volunteer-connect-2.png',
      '/images/projects/volunteer-connect-3.png',
    ],
    link: 'https://git.cs.usask.ca/ujc862/cmpt-370-fall-2023.git',
    featured: false,
    role: 'Team Lead',
    year: '2023',
    order: 4,
  },
]
