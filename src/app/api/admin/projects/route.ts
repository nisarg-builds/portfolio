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

  try {
    const data = await request.json()
    const { slug, ...rest } = data

    if (!slug || !rest.title) {
      return NextResponse.json({ error: 'Missing required fields: slug and title' }, { status: 400 })
    }

    const existing = await adminDb.collection('projects').doc(slug).get()
    if (existing.exists) {
      return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 409 })
    }

    const countSnapshot = await adminDb.collection('projects').count().get()
    const nextOrder = countSnapshot.data().count

    await adminDb.collection('projects').doc(slug).set({
      slug,
      ...rest,
      order: nextOrder,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    revalidateTag('projects')
    revalidateTag('page')
    return NextResponse.json({ success: true, slug })
  } catch (err) {
    console.error('Failed to create project:', err)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { slug, ...rest } = data

    await adminDb.collection('projects').doc(slug).update({
      ...rest,
      updatedAt: FieldValue.serverTimestamp(),
    })

    revalidateTag('projects')
    revalidateTag('page')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to update project:', err)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
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
