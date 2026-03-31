import { adminDb } from '@/lib/firebase/admin'
import { ProjectList } from '@/components/admin/project-list'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  // Fetch without orderBy — Firestore silently excludes docs missing the order field
  const snapshot = await adminDb.collection('projects').get()

  // Backfill missing order fields so they appear in queries
  const docsWithoutOrder = snapshot.docs.filter((doc) => doc.data().order === undefined)
  if (docsWithoutOrder.length > 0) {
    const batch = adminDb.batch()
    const maxOrder = snapshot.docs.reduce((max, doc) => {
      const order = doc.data().order
      return typeof order === 'number' ? Math.max(max, order) : max
    }, -1)
    docsWithoutOrder.forEach((doc, i) => {
      batch.update(doc.ref, { order: maxOrder + 1 + i })
    })
    await batch.commit()
  }

  const projects = snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      slug: doc.id,
      title: data.title ?? '',
      description: data.description ?? '',
      fullDescription: data.fullDescription ?? '',
      tags: data.tags ?? [],
      image: data.image ?? '',
      screenshots: data.screenshots ?? [],
      link: data.link ?? '',
      featured: data.featured ?? false,
      role: data.role ?? undefined,
      order: data.order ?? 0,
    }
  }).sort((a, b) => a.order - b.order)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-(family-name:--font-display) text-2xl font-bold">Projects</h1>
        <a
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover transition-colors"
        >
          + Add Project
        </a>
      </div>
      <ProjectList initialProjects={projects} />
    </div>
  )
}
