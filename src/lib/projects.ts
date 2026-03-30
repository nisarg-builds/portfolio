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
}
