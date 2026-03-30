# 06 — Content Map

> Every piece of text, image, link, and asset mapped to its exact location in the site.
> Items marked **[PLACEHOLDER]** need Nisarg to provide or confirm.

---

## Hero Section

| Content | Value | Notes |
|---------|-------|-------|
| Live clock | `{date} {time}` | Auto-generated, format: `29/03/2026 14:32`, mono font |
| Name | `Nisarg Chaudhary` | DynamicHeading, `as="h1"`, text-display |
| Tagline | **[PLACEHOLDER]** `Developer. Designer. Artist.` | Nisarg to customize — text-xl, text-secondary |
| Subtitle | **[PLACEHOLDER]** `CS Honours + Studio Arts — currently building at [company]` | Update with internship company name |
| CTA Button 1 | `View Projects` | Primary variant, scrolls to Projects section |
| CTA Button 2 | `Get in Touch` | Outline variant, scrolls to Contact section |
| Decorative SVGs | Cherry blossom, flower, cactus | 1-2 on mobile, 3-5 on desktop |

---

## About Section

| Content | Value | Notes |
|---------|-------|-------|
| Section title | `About Me` | SectionHeading with wavy divider |
| Bio paragraph 1 | **[PLACEHOLDER]** `Hello! My name is Nisarg Chaudhary. I'm a Computer Science Honours student at the University of Saskatchewan with a minor in Studio Arts. Originally from India, I moved to Canada to pursue my passion for technology and design.` | Update for current status |
| Bio paragraph 2 | **[PLACEHOLDER]** `Currently on an internship at [company], I'm building [what]. I'm passionate about crafting beautiful, functional interfaces that bridge the gap between art and engineering.` | Update with internship details |
| Bio paragraph 3 | **[PLACEHOLDER]** `When I'm not coding, you'll find me [hobby/interest]. I love learning new things and keeping myself busy — reason #101 why I built this website.` | Personal touch |
| Portrait image | `NisargBrand.png` (or updated photo) | aspect-square on desktop, aspect-[4/3] on mobile |
| Resume button | `Resume` | Links to `/resume.pdf`, outline button, opens new tab |

### Skills Marquee Items

```
React · Next.js · TypeScript · JavaScript · Python · Java · C · HTML · CSS ·
Tailwind · Bootstrap · GSAP · Framer Motion · Node.js · Express · PostgreSQL ·
MySQL · MongoDB · Docker · Git · Figma · UI/UX Design
```

> Nisarg to review and update this list. Order matters — put strongest/most relevant first.

---

## Projects Section

### Project 1: PCubed (Featured)

| Field | Value |
|-------|-------|
| Title | `PCubed` |
| Slug | `pcubed` |
| Featured | `true` (spans 2 columns on desktop) |
| Description (card) | `University group project with 12 team members. Built a web app for cataloging Projectile Point Artifacts with a structured database.` |
| Description (full) | `This was a group project made for a university class with a group of 12 people, who were assigned real Software Management roles, namely, Project Manager (Me), Build Master, Test and Dev teams, Risk Officers and Triage team. We worked with a Stakeholder to build the first part of a web-app which he desired to further work on. Our task included making an interactive and visually appealing UI experience and a structured database catalog to store Projectile Point Artifacts. It was a fun project to work on and I learned so many things about software development and management. Through my role of Project Manager, I gained insights on what it takes to work with a larger team — some of the challenges I tackled were communication and on-time product delivery, when you have a diverse group of people with unique schedules.` |
| Tags | `PostgreSQL`, `React`, `MaterialUI`, `Docker` |
| Image (featured) | `PC-1.png` |
| Screenshots | `PC-1.png`, `PC-2.png`, `PC-3.png`, `PC-4.png`, `PC-5.png` |
| Link | `https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-4` |
| Role highlight | `Project Manager` |

### Project 2: Code Community

| Field | Value |
|-------|-------|
| Title | `Code Community` |
| Slug | `code-community` |
| Featured | `false` |
| Description (card) | `A Reddit-like platform for programmers. Features channels, topics, search, and community engagement.` |
| Description (full) | `The Code Community is one of the fastest and biggest projects that I have made for my class CMPT 353. This course had a set of requirements for the project and they wanted us to make a clone of Reddit, with fewer features. My project features some of the important features of Reddit, such as assorting all posts under channels and calling them topics, search using topic, channels and tag names, joining channels and topics, and sub-reddits. This project uses MySQL as the database. Three words to describe it: learning, deadline, fun.` |
| Tags | `React`, `Express`, `Node.js`, `MySQL`, `Bootstrap` |
| Image (featured) | `CodeCommunity.png` |
| Screenshots | `CodeCommunity.png` |
| Link | `https://git.cs.usask.ca/ujc862/project-353-the-code-community.git` |

### Project 3: Volunteer Connect

| Field | Value |
|-------|-------|
| Title | `Volunteer Connect` |
| Slug | `volunteer-connect` |
| Featured | `false` |
| Description (card) | `A platform connecting students with volunteer organizations. My first team project in software development.` |
| Description (full) | `This was my first ever group project based on Software Development, where I learned some basic concepts of Agile-Scrum, software development and working in a team. This project made me confident to talk with team members and how to build projects in an asynchronous environment. The best and worst part about this project was learning new technology while creating deliverables. I also learned how important it is for a team to have a leader, as we didn't have any at first but as we went into the project we felt we needed someone to guide us, and that's when I took the initiative to lead the team as the project idea was mine.` |
| Tags | `MongoDB`, `React`, `Express`, `Docker` |
| Image (featured) | `VCLogin.png` |
| Screenshots | `VCLogin.png`, `VCRegister.png`, `VCProfilePage.png` |
| Link | `https://git.cs.usask.ca/ujc862/cmpt-370-fall-2023.git` |

### Project 4: Pathfinding Visualizer

| Field | Value |
|-------|-------|
| Title | `Pathfinding Visualizer` |
| Slug | `pathfinding-visualizer` |
| Featured | `false` |
| Description (card) | `Visualize different pathfinding algorithms (A*, BFS, Dijkstra) finding paths through barriers in real-time.` |
| Description (full) | `This was one of my personal projects made in summer 2024, when I was trying to learn new algorithms and started searching for shortest distance algorithms. This project explores different pathfinding algorithms and visualizes the paths taken and possibilities searched when finding a path between start and end points with some barriers on the way. It was fun learning different algorithm approaches using the visualizer I made.` |
| Tags | `Python`, `PyGame` |
| Image (featured) | `PFVwithEditor2.png` |
| Screenshots | `PFVisualizer.png`, `PFVDiffAlgo.png`, `PFVwithEditor.png`, `PFVwithEditor2.png` |
| Link | `https://github.com/nisarg-11-here/Pathfinding_Visualizer` |

### Project Data Type

```typescript
// src/lib/projects.ts

export interface Project {
  title: string
  slug: string
  description: string         // Short (for card)
  fullDescription: string     // Long (for detail page)
  tags: string[]
  image: string               // Featured image path
  screenshots: string[]       // Additional images
  link: string                // GitHub or live URL
  featured: boolean
  role?: string               // Optional role highlight
}
```

---

## Contact Section

| Content | Value |
|---------|-------|
| Section title | `Get in Touch` |
| Message | `Feel free to connect with me!` |
| Email CTA button | `Say Hello` → `mailto:chaudharynisarg555@gmail.com` |

### Social Links

| Platform | URL | Icon |
|----------|-----|------|
| GitHub | `https://github.com/nisarg-11-here` | github.svg |
| LinkedIn | `https://www.linkedin.com/in/nisargchaudhary/` | linkedin.svg |
| Instagram | `https://www.instagram.com/nisarg.11/` | instagram.svg |
| Email | `mailto:chaudharynisarg555@gmail.com` | email.svg |

---

## Navigation Links

| Label | Route | Type |
|-------|-------|------|
| Home | `/` | Internal, scroll to top |
| Projects | `/#projects` | Internal, scroll to section on home (or `/` + scroll) |
| Blog | `/blog` | Internal route |
| Playground | `/playground` | Internal route |
| Contact | `/#contact` | Internal, scroll to section on home |

---

## Blog

Initially empty — structure is ready for MDX posts.

### Blog Post Frontmatter Schema

```yaml
---
title: "Post Title"
date: "2026-03-29"
excerpt: "A brief summary for the listing page."
tags: ["React", "Design"]
published: true
---
```

### Starter Post (Optional)

Nisarg could write a first post about building this portfolio — meta and fun. **[PLACEHOLDER]** — not required for launch.

---

## Playground

### Experiment 1: Generative Art

| Field | Value |
|-------|-------|
| Title | `Generative Art` |
| Description | `Procedural patterns and creative coding with p5.js` |
| Type | Inline canvas or link to CodePen/standalone page |
| Status | **[PLACEHOLDER]** — build after core site is complete |

### Experiment 2: Pathfinding

| Field | Value |
|-------|-------|
| Title | `Pathfinding Visualizer` |
| Description | `Interactive pathfinding algorithm visualization` |
| Type | Embedded or link to existing project |
| Status | **[PLACEHOLDER]** — can embed the existing Python project as a web version later |

> The playground page should look complete with a "More experiments coming soon..." message even if only 1-2 experiments exist at launch.

---

## Footer

| Content | Value |
|---------|-------|
| Attribution | `Designed & built by Nisarg Chaudhary` | Mono font, text-xs, text-tertiary |
| Social icons | Same 4 as Contact section (smaller, 20px) |

---

## SEO & Meta

### Global (Root Layout)

```typescript
export const metadata: Metadata = {
  title: {
    default: 'Nisarg Chaudhary — Developer, Designer, Artist',
    template: '%s | Nisarg Chaudhary',
  },
  description: 'Portfolio of Nisarg Chaudhary — CS Honours student and Studio Arts minor. Software development, frontend engineering, and design.',
  metadataBase: new URL('https://nisargchaudhary.com'),  // [PLACEHOLDER] — update with actual domain
  openGraph: {
    title: 'Nisarg Chaudhary — Developer, Designer, Artist',
    description: 'Portfolio of Nisarg Chaudhary',
    url: 'https://nisargchaudhary.com',
    siteName: 'Nisarg Chaudhary',
    locale: 'en_US',
    type: 'website',
    images: ['/images/brand/og-image.png'],  // [PLACEHOLDER] — create OG image (1200x630)
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nisarg Chaudhary — Developer, Designer, Artist',
    description: 'Portfolio of Nisarg Chaudhary',
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### Per-Page Titles

| Page | Title |
|------|-------|
| Home | `Nisarg Chaudhary — Developer, Designer, Artist` (default) |
| Project Detail | `{Project Title} | Nisarg Chaudhary` |
| Blog Listing | `Blog | Nisarg Chaudhary` |
| Blog Post | `{Post Title} | Nisarg Chaudhary` |
| Playground | `Playground | Nisarg Chaudhary` |
| 404 | `Page Not Found | Nisarg Chaudhary` |

---

## Asset Migration Table

Files from the old portfolio to copy into the new project:

| Source (old) | Destination (new) | Notes |
|-------------|-------------------|-------|
| `Assets/NisargBrand.png` | `public/images/brand/portrait.png` | Main portrait photo |
| `Assets/brandICON.png` | `public/images/brand/favicon.png` | Favicon — also convert to .ico |
| `public/Resume.pdf` | `public/resume.pdf` | Most recent version (78KB) |
| `Assets/email.svg` | Inline in `social-icon.tsx` | Inline SVG, not file |
| `Assets/github.svg` | Inline in `social-icon.tsx` | Inline SVG, not file |
| `Assets/instagram.svg` | Inline in `social-icon.tsx` | Inline SVG, not file |
| `Assets/linkedin.svg` | Inline in `social-icon.tsx` | Inline SVG, not file |
| `Assets/Decoration-Icons/flower-orange-3.svg` | `public/images/decorative/flower.svg` | Hero decoration |
| `Assets/Decoration-Icons/cactus.svg` | `public/images/decorative/cactus.svg` | Hero/404 decoration |
| `Assets/Decoration-Icons/tree.svg` | `public/images/decorative/tree.svg` | Optional decoration |
| `Assets/Decoration-Icons/leaves-2.svg` | `public/images/decorative/leaves.svg` | Optional decoration |
| `Assets/Decoration-Icons/deer.svg` | `public/images/decorative/deer.svg` | Optional decoration |
| `Assets/Project-imgs/PC-1.png` | `public/images/projects/pcubed-1.png` | Optimize/compress |
| `Assets/Project-imgs/PC-2.png` | `public/images/projects/pcubed-2.png` | Optimize/compress |
| `Assets/Project-imgs/PC-3.png` | `public/images/projects/pcubed-3.png` | Optimize/compress |
| `Assets/Project-imgs/PC-4.png` | `public/images/projects/pcubed-4.png` | Optimize/compress |
| `Assets/Project-imgs/PC-5.png` | `public/images/projects/pcubed-5.png` | Optimize/compress |
| `Assets/Project-imgs/CodeCommunity.png` | `public/images/projects/code-community.png` | Optimize/compress |
| `Assets/Project-imgs/VCLogin.png` | `public/images/projects/volunteer-connect-1.png` | Optimize/compress |
| `Assets/Project-imgs/VCRegister.png` | `public/images/projects/volunteer-connect-2.png` | Optimize/compress |
| `Assets/Project-imgs/VCProfilePage.png` | `public/images/projects/volunteer-connect-3.png` | Optimize/compress |
| `Assets/Project-imgs/PFVisualizer.png` | `public/images/projects/pathfinding-1.png` | Optimize/compress |
| `Assets/Project-imgs/PFVDiffAlgo.png` | `public/images/projects/pathfinding-2.png` | Optimize/compress |
| `Assets/Project-imgs/PFVwithEditor.png` | `public/images/projects/pathfinding-3.png` | Optimize/compress |
| `Assets/Project-imgs/PFVwithEditor2.png` | `public/images/projects/pathfinding-4.png` | Optimize/compress |

### New Assets Needed

| Asset | Purpose | Spec |
|-------|---------|------|
| **[PLACEHOLDER]** OG Image | Social sharing preview | 1200x630px, PNG, dark bg with name + tagline |
| **[PLACEHOLDER]** Updated portrait | About section | High-quality, recent photo |
| **[PLACEHOLDER]** Favicon set | Browser tabs, PWA | 16x16, 32x32, 180x180 (apple-touch), SVG |

> Project screenshots should be optimized before copying — many are 1-2MB. Target: <200KB each using compression tools or `next/image` will handle optimization at build time.
