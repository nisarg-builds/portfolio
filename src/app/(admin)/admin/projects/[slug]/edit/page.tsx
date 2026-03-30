import { notFound } from 'next/navigation'
import { adminDb } from '@/lib/firebase/admin'
import { ProjectForm } from '@/components/admin/project-form'

export const dynamic = 'force-dynamic'

interface EditProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { slug } = await params
  const doc = await adminDb.collection('projects').doc(slug).get()

  if (!doc.exists) {
    notFound()
  }

  const data = doc.data()!
  const project = {
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
  }

  return (
    <div>
      <h1 className="font-(family-name:--font-display) text-2xl font-bold mb-8">
        Edit: {project.title}
      </h1>
      <ProjectForm mode="edit" initialData={project} />
    </div>
  )
}
