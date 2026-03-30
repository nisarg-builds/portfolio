import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
})

const db = getFirestore(app)

const projects = [
  {
    title: 'PCubed',
    slug: 'pcubed',
    description:
      'University group project with 12 team members. Built a web app for cataloging Projectile Point Artifacts with a structured database.',
    fullDescription:
      'This was a group project made for a university class with a group of 12 people, who were assigned real Software Management roles, namely, Project Manager (Me), Build Master, Test and Dev teams, Risk Officers and Triage team. We worked with a Stakeholder to build the first part of a web-app which he desired to further work on. Our task included making an interactive and visually appealing UI experience and a structured database catalog to store Projectile Point Artifacts. It was a fun project to work on and I learned so many things about software development and management. Through my role of Project Manager, I gained insights on what it takes to work with a larger team — some of the challenges I tackled were communication and on-time product delivery, when you have a diverse group of people with unique schedules.',
    tags: ['PostgreSQL', 'React', 'MaterialUI', 'Docker'],
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
  },
  {
    title: 'Code Community',
    slug: 'code-community',
    description:
      'A Reddit-like platform for programmers. Features channels, topics, search, and community engagement.',
    fullDescription:
      'The Code Community is one of the fastest and biggest projects that I have made for my class CMPT 353. This course had a set of requirements for the project and they wanted us to make a clone of Reddit, with fewer features. My project features some of the important features of Reddit, such as assorting all posts under channels and calling them topics, search using topic, channels and tag names, joining channels and topics, and sub-reddits. This project uses MySQL as the database. Three words to describe it: learning, deadline, fun.',
    tags: ['React', 'Express', 'Node.js', 'MySQL', 'Bootstrap'],
    image: '/images/projects/code-community.png',
    screenshots: ['/images/projects/code-community.png'],
    link: 'https://git.cs.usask.ca/ujc862/project-353-the-code-community.git',
    featured: false,
  },
  {
    title: 'Volunteer Connect',
    slug: 'volunteer-connect',
    description:
      'A platform connecting students with volunteer organizations. My first team project in software development.',
    fullDescription:
      "This was my first ever group project based on Software Development, where I learned some basic concepts of Agile-Scrum, software development and working in a team. This project made me confident to talk with team members and how to build projects in an asynchronous environment. The best and worst part about this project was learning new technology while creating deliverables. I also learned how important it is for a team to have a leader, as we didn't have any at first but as we went into the project we felt we needed someone to guide us, and that's when I took the initiative to lead the team as the project idea was mine.",
    tags: ['MongoDB', 'React', 'Express', 'Docker'],
    image: '/images/projects/volunteer-connect-1.png',
    screenshots: [
      '/images/projects/volunteer-connect-1.png',
      '/images/projects/volunteer-connect-2.png',
      '/images/projects/volunteer-connect-3.png',
    ],
    link: 'https://git.cs.usask.ca/ujc862/cmpt-370-fall-2023.git',
    featured: false,
  },
  {
    title: 'Pathfinding Visualizer',
    slug: 'pathfinding-visualizer',
    description:
      'Visualize different pathfinding algorithms (A*, BFS, Dijkstra) finding paths through barriers in real-time.',
    fullDescription:
      'This was one of my personal projects made in summer 2024, when I was trying to learn new algorithms and started searching for shortest distance algorithms. This project explores different pathfinding algorithms and visualizes the paths taken and possibilities searched when finding a path between start and end points with some barriers on the way. It was fun learning different algorithm approaches using the visualizer I made.',
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
  },
]

async function seed() {
  console.log('Seeding Firestore...')

  const batch = db.batch()

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]
    const ref = db.collection('projects').doc(project.slug)
    batch.set(ref, {
      ...project,
      order: i,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    console.log(`  Queued project: ${project.title} (order: ${i})`)
  }

  const aboutRef = db.collection('site-settings').doc('about')
  batch.set(aboutRef, {
    portraitUrl: '/images/brand/portrait.png',
    portraitGallery: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  console.log('  Queued site-settings/about')

  await batch.commit()
  console.log('Seeding complete! Wrote %d projects + about settings.', projects.length)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
