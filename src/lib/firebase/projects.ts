import 'server-only'
import { adminDb } from './admin'
import type { Project } from '@/lib/projects'

function docToProject(doc: FirebaseFirestore.DocumentSnapshot): Project {
  const data = doc.data()!
  return {
    title: data.title,
    slug: data.slug,
    description: data.description,
    fullDescription: data.fullDescription,
    tags: data.tags,
    image: data.image,
    screenshots: data.screenshots || [],
    link: data.link,
    featured: data.featured || false,
    role: data.role || undefined,
  } as Project
}

export async function getProjects(): Promise<Project[]> {
  const snapshot = await adminDb
    .collection('projects')
    .orderBy('order', 'asc')
    .get()

  return snapshot.docs.map(docToProject)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const doc = await adminDb.collection('projects').doc(slug).get()
  if (!doc.exists) return null
  return docToProject(doc)
}

export async function getProjectSlugs(): Promise<string[]> {
  const snapshot = await adminDb.collection('projects').select().get()
  return snapshot.docs.map((doc) => doc.id)
}
