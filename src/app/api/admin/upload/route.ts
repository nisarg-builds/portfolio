import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { uploadToStorage } from '@/lib/firebase/storage'
import { validateUploadFile, sanitizeFilename } from '@/lib/validation'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  if (!token || token !== process.env.ADMIN_TOKEN_VALUE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const storagePath = formData.get('path') as string | null

  if (!file || !storagePath) {
    return NextResponse.json({ error: 'Missing file or path' }, { status: 400 })
  }

  const validation = validateUploadFile(file)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const safeName = `${Date.now()}-${sanitizeFilename(file.name)}`
  const fullPath = `${storagePath}/${safeName}`

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadToStorage(buffer, fullPath, file.type)
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
