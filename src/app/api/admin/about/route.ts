import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import { sanitizeAboutData } from '@/lib/validation'

export async function PUT(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  if (!token || token !== process.env.ADMIN_TOKEN_VALUE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const sanitized = sanitizeAboutData(data)
  if (Object.keys(sanitized).length === 0) {
    return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
  }

  try {
    await adminDb.collection('site-settings').doc('about').set({
      ...sanitized,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true })

    revalidateTag('about')
    revalidateTag('page')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update about settings' }, { status: 500 })
  }
}
