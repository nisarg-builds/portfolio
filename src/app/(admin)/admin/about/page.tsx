import { adminDb } from '@/lib/firebase/admin'
import { PortraitManager } from '@/components/admin/portrait-manager'
import type { PortraitCrop } from '@/lib/firebase/about'

export const dynamic = 'force-dynamic'

export default async function AdminAboutPage() {
  const doc = await adminDb.collection('site-settings').doc('about').get()
  const data = doc.exists ? doc.data()! : {}

  const portraitUrl = (data.portraitUrl as string) ?? ''
  const portraitGallery = (data.portraitGallery as string[]) ?? []
  if (portraitUrl && !portraitGallery.includes(portraitUrl)) {
    portraitGallery.unshift(portraitUrl)
  }

  const aboutSettings = {
    portraitUrl,
    portraitGallery,
    portraitCrop: (data.portraitCrop as PortraitCrop | null) ?? null,
  }

  return (
    <div>
      <h1 className="font-(family-name:--font-display) text-2xl font-bold mb-8">About / Portrait</h1>
      <PortraitManager
        initialPortraitUrl={aboutSettings.portraitUrl}
        initialGallery={aboutSettings.portraitGallery}
        initialCrop={aboutSettings.portraitCrop}
      />
    </div>
  )
}
