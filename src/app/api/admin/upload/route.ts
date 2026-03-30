import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { uploadToStorage } from '@/lib/firebase/storage'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  if (!token || token !== process.env.ADMIN_TOKEN_VALUE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const path = formData.get('path') as string | null

  if (!file || !path) {
    return NextResponse.json({ error: 'Missing file or path' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const url = await uploadToStorage(buffer, path, file.type)

  return NextResponse.json({ url })
}
