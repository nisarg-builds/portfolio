import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function PUT(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  if (!token || token !== process.env.ADMIN_TOKEN_VALUE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()

  await adminDb.collection('site-settings').doc('about').set({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true })

  revalidateTag('about', 'page')
  revalidateTag('page', 'page')
  return NextResponse.json({ success: true })
}
