import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export const metadata: Metadata = {
  title: 'Admin | Nisarg Chaudhary',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-4 py-4 sm:p-6 lg:p-10 pt-16 lg:pt-10 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
