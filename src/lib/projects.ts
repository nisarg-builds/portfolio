export interface Project {
  title: string
  slug: string
  description: string
  fullDescription: string
  tags: string[]
  image: string
  /** Shown beside the title in the project index. Without one, the row has no image. */
  logo?: string
  /** A file visitors can download, such as a .dmg. Shown on the detail page. */
  download?: string
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
    logo: '/images/projects/logos/fitglass.png',
    screenshots: [],
    link: '/fitglass',
    featured: true,
    role: 'Solo build',
    year: '2026',
    order: 0,
  },
  {
    title: 'Isle',
    slug: 'isle',
    description:
      'A to-do list that lives in the MacBook notch. Press ⌃⌥T, type “groceries 5pm”, and the island reminds you at five.',
    fullDescription:
      'A native macOS app in SwiftUI and AppKit that turns the notch into a small Dynamic Island for tasks. Closed, it hides in the notch and shows only a progress ring and the time of the next task. Press ⌃⌥T from any app, type “groceries 5pm”, and the task exists before the thought is gone; at five the island drops down and asks if it is done. The interesting problem was the parser. It reads only the last words of a task, so “Monday night football” stays a title instead of becoming a Monday reminder, and the chips under the field write their words into it, so you always see what the task will get. Everything stays in one JSON file on your Mac: no account, no network.',
    tags: ['Swift', 'SwiftUI', 'AppKit'],
    image: '/images/projects/isle-quick-add.png',
    logo: '/images/projects/logos/isle.png',
    download: '/downloads/Isle.dmg',
    screenshots: ['/images/projects/isle-quick-add.png'],
    link: 'https://github.com/nisarg-11-here/Isle',
    featured: false,
    role: 'Solo build',
    year: '2026',
    order: 1,
  },
  {
    title: 'MindOcean',
    slug: 'mindocean',
    description:
      'Notes for iPad and iPhone where text, Apple Pencil sketches and code share one page, and the page is becoming a canvas.',
    fullDescription:
      'A notes app where text, Apple Pencil sketches and code blocks live in one document. It began as a rebuild of a prototype that did not work: its export buttons were stubs and its data synced through CloudKit twice. The rebuild moved it to Swift 6, SwiftData and the Observation framework, with PencilKit for ink. The current work turns the page from a list into a canvas. A block gains a position and a width, nothing reflows, and reading order comes from the layout through a recursive XY cut, so search, export and the PDF writer keep working without an edit. Deciding what a document is, once its blocks have coordinates, was the hard part.',
    tags: ['Swift 6', 'SwiftUI', 'SwiftData', 'PencilKit'],
    image: '',
    logo: '/images/projects/logos/mindocean.png',
    screenshots: [],
    link: '',
    featured: false,
    role: 'Solo build',
    year: '2026',
    order: 2,
  },
  {
    title: 'MonitorBar',
    slug: 'monitorbar',
    description:
      'A macOS menu bar app that controls an MSI ultrawide over DDC/CI: brightness, contrast, volume, input and colour, without the buttons on the back.',
    fullDescription:
      "A native menu bar app built for one monitor, the MSI Optix MAG342CQR. The monitor has no USB port, so MSI's own software cannot reach it. MonitorBar talks to it over DDC/CI on the DisplayPort cable instead, through Apple's private IOAVService API on Apple silicon. Most of the work was learning how the monitor misbehaves. It drops the first write it receives, so every request goes out twice. It also drops a setting that arrives while it is still applying the last one, and reports success anyway, so each write is read back and resent until the monitor agrees. Probing found 45 VCP codes, four of them undocumented, which now sit under an Experimental panel. The lesson: when hardware says yes, check.",
    tags: ['Swift', 'SwiftUI', 'Objective-C', 'DDC/CI'],
    image: '',
    screenshots: [],
    link: '',
    featured: false,
    role: 'Claude quick · Personal problem',
    year: '2026',
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
    order: 7,
  },
]
