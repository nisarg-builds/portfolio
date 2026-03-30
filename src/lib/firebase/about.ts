import 'server-only'
import { adminDb } from './admin'

export interface PortraitCrop {
  x: number
  y: number
  width: number
  height: number
}

interface AboutSettings {
  portraitUrl: string
  portraitGallery: string[]
  portraitCrop: PortraitCrop | null
}

export async function getAboutSettings(): Promise<AboutSettings> {
  try {
    const doc = await adminDb.collection('site-settings').doc('about').get()
    if (!doc.exists) {
      return { portraitUrl: '/images/brand/portrait.png', portraitGallery: [], portraitCrop: null }
    }
    const data = doc.data()!
    return {
      portraitUrl: data.portraitUrl || '/images/brand/portrait.png',
      portraitGallery: data.portraitGallery || [],
      portraitCrop: (data.portraitCrop as PortraitCrop | undefined) ?? null,
    }
  } catch {
    return { portraitUrl: '/images/brand/portrait.png', portraitGallery: [], portraitCrop: null }
  }
}
