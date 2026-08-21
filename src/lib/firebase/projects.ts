import 'server-only'
import { adminDb, hasFirebaseCredentials } from './admin'
import { FALLBACK_PROJECTS, type Project } from '@/lib/projects'

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
    year: data.year || undefined,
    order: data.order ?? 0,
  }
}

/**
 * Firestore is the system of record, but the Projects section is the point of
 * the site — so an unconfigured or unreachable Firestore falls back to the
 * static list rather than rendering nothing.
 */
export async function getProjects(): Promise<Project[]> {
  if (!hasFirebaseCredentials) return FALLBACK_PROJECTS

  try {
    // Fetched without orderBy: Firestore silently drops docs missing the field.
    const snapshot = await adminDb.collection('projects').get()
    if (snapshot.empty) return FALLBACK_PROJECTS
    return snapshot.docs.map(docToProject).sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('[projects] Firestore read failed, using fallback data:', error)
    return FALLBACK_PROJECTS
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const fallback = FALLBACK_PROJECTS.find((project) => project.slug === slug) ?? null
  if (!hasFirebaseCredentials) return fallback

  try {
    const doc = await adminDb.collection('projects').doc(slug).get()
    if (!doc.exists) return fallback
    return docToProject(doc)
  } catch (error) {
    console.error(`[projects] Firestore read failed for "${slug}", using fallback:`, error)
    return fallback
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  if (!hasFirebaseCredentials) return FALLBACK_PROJECTS.map((project) => project.slug)

  try {
    const snapshot = await adminDb.collection('projects').select().get()
    if (snapshot.empty) return FALLBACK_PROJECTS.map((project) => project.slug)
    return snapshot.docs.map((doc) => doc.id)
  } catch (error) {
    console.error('[projects] Firestore slug read failed, using fallback:', error)
    return FALLBACK_PROJECTS.map((project) => project.slug)
  }
}
