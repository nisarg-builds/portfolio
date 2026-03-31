import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

async function verifyAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  return !!token && token === process.env.ADMIN_TOKEN_VALUE
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  const { slug, ...rest } = data

  await adminDb.collection('projects').doc(slug).set({
    slug,
    ...rest,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  revalidateTag('projects')
  revalidateTag('page')
  return NextResponse.json({ success: true, slug })
}

export async function PUT(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  const { slug, ...rest } = data

  await adminDb.collection('projects').doc(slug).update({
    ...rest,
    updatedAt: FieldValue.serverTimestamp(),
  })

  revalidateTag('projects')
  revalidateTag('page')
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await request.json()
  await adminDb.collection('projects').doc(slug).delete()

  revalidateTag('projects')
  revalidateTag('page')
  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { orderedSlugs } = await request.json()
  const batch = adminDb.batch()

  orderedSlugs.forEach((slug: string, index: number) => {
    const ref = adminDb.collection('projects').doc(slug)
    batch.update(ref, { order: index, updatedAt: FieldValue.serverTimestamp() })
  })

  await batch.commit()
  revalidateTag('projects')
  revalidateTag('page')
  return NextResponse.json({ success: true })
}
