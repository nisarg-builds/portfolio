import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import {
  isValidSlug,
  isStringArray,
  validateProjectData,
  sanitizeProjectData,
} from '@/lib/validation'

async function verifyAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  return !!token && token === process.env.ADMIN_TOKEN_VALUE
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const validation = validateProjectData(data)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const slug = data.slug as string
  const sanitized = sanitizeProjectData(data)

  try {
    const existing = await adminDb.collection('projects').doc(slug).get()
    if (existing.exists) {
      return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 409 })
    }

    const countSnapshot = await adminDb.collection('projects').count().get()
    const nextOrder = countSnapshot.data().count

    await adminDb.collection('projects').doc(slug).set({
      ...sanitized,
      order: nextOrder,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, slug })
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const slug = data.slug
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  const sanitized = sanitizeProjectData(data)
  delete sanitized.slug

  try {
    await adminDb.collection('projects').doc(slug).update({
      ...sanitized,
      updatedAt: FieldValue.serverTimestamp(),
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const slug = data.slug
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  try {
    await adminDb.collection('projects').doc(slug).delete()
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { orderedSlugs } = data
  if (!isStringArray(orderedSlugs) || !orderedSlugs.every(isValidSlug)) {
    return NextResponse.json({ error: 'orderedSlugs must be an array of valid slugs' }, { status: 400 })
  }

  try {
    const batch = adminDb.batch()
    orderedSlugs.forEach((slug: string, index: number) => {
      const ref = adminDb.collection('projects').doc(slug)
      batch.update(ref, { order: index, updatedAt: FieldValue.serverTimestamp() })
    })

    await batch.commit()
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to reorder projects' }, { status: 500 })
  }
}
