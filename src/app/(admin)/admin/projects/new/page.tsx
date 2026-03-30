import { ProjectForm } from '@/components/admin/project-form'

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-(family-name:--font-display) text-2xl font-bold mb-8">New Project</h1>
      <ProjectForm mode="create" />
    </div>
  )
}
