import 'server-only'
import { adminDb } from './admin'
import type { Project } from '@/lib/projects'

function docToProject(doc: FirebaseFirestore.DocumentSnapshot): Project {
  const data = doc.data()!
  return {
    title: data.title ?? '',
    slug: data.slug ?? doc.id,
    description: data.description ?? '',
    fullDescription: data.fullDescription ?? '',
    tags: data.tags ?? [],
    image: data.image ?? '',
    screenshots: data.screenshots ?? [],
    link: data.link ?? '',
    featured: data.featured ?? false,
    role: data.role || undefined,
    order: data.order ?? 0,
  }
}

export async function getProjects(): Promise<Project[]> {
  // Fetch without orderBy — Firestore silently excludes docs missing the order field
  const snapshot = await adminDb.collection('projects').get()
  return snapshot.docs.map(docToProject).sort((a, b) => a.order - b.order)
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
