import 'server-only'
import { adminBucket } from './admin'

export async function uploadToStorage(
  buffer: Buffer,
  path: string,
  contentType: string
): Promise<string> {
  const file = adminBucket.file(path)
  await file.save(buffer, {
    contentType,
    public: true,
    metadata: { cacheControl: 'public, max-age=31536000' },
  })
  const publicUrl = `https://storage.googleapis.com/${adminBucket.name}/${path}`
  return publicUrl
}

export async function deleteFromStorage(path: string): Promise<void> {
  try {
    await adminBucket.file(path).delete()
  } catch {
    // File may not exist, ignore
  }
}
