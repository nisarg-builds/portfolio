// Lightweight validation helpers — no external dependencies

export function isNonEmptyString(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0
}

export function isValidSlug(val: unknown): val is string {
  return typeof val === 'string' && /^[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$/.test(val)
}

export function isValidUrl(val: unknown): boolean {
  if (typeof val !== 'string') return false
  try {
    const url = new URL(val)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((v) => typeof v === 'string')
}

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
])

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024 // 10 MB

export function validateUploadFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { valid: false, error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, SVG.` }
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    return { valid: false, error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 10MB.` }
  }
  return { valid: true }
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .slice(0, 100)
}

// Only Firebase Storage hosts allowed — prevents SSRF attacks via image proxy
const ALLOWED_PROXY_HOSTS = new Set([
  'storage.googleapis.com',
  'firebasestorage.googleapis.com',
])

export function isAllowedProxyUrl(val: string): boolean {
  try {
    const url = new URL(val)
    if (url.protocol !== 'https:') return false
    return ALLOWED_PROXY_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

const ABOUT_ALLOWED_FIELDS = new Set([
  'bio',
  'portraitUrl',
  'portraitCrop',
  'resumeUrl',
  'skills',
])

export function sanitizeAboutData(data: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {}
  for (const key of Object.keys(data)) {
    if (ABOUT_ALLOWED_FIELDS.has(key)) {
      clean[key] = data[key]
    }
  }
  return clean
}

const PROJECT_ALLOWED_FIELDS = new Set([
  'title',
  'slug',
  'description',
  'fullDescription',
  'tags',
  'image',
  'screenshots',
  'link',
  'featured',
  'role',
  'order',
])

export function sanitizeProjectData(data: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {}
  for (const key of Object.keys(data)) {
    if (PROJECT_ALLOWED_FIELDS.has(key)) {
      clean[key] = data[key]
    }
  }
  return clean
}

export function validateProjectData(data: Record<string, unknown>): { valid: boolean; error?: string } {
  if (!isNonEmptyString(data.title)) {
    return { valid: false, error: 'Title is required' }
  }
  if (!isValidSlug(data.slug)) {
    return { valid: false, error: 'Invalid slug format (lowercase alphanumeric + hyphens, 2-100 chars)' }
  }
  if (data.description !== undefined && typeof data.description !== 'string') {
    return { valid: false, error: 'Description must be a string' }
  }
  if (data.fullDescription !== undefined && typeof data.fullDescription !== 'string') {
    return { valid: false, error: 'Full description must be a string' }
  }
  if (data.tags !== undefined && !isStringArray(data.tags)) {
    return { valid: false, error: 'Tags must be an array of strings' }
  }
  if (data.link !== undefined && !isValidUrl(data.link)) {
    return { valid: false, error: 'Invalid project URL' }
  }
  if (data.image !== undefined && typeof data.image !== 'string') {
    return { valid: false, error: 'Image must be a string URL' }
  }
  if (data.screenshots !== undefined && !isStringArray(data.screenshots)) {
    return { valid: false, error: 'Screenshots must be an array of strings' }
  }
  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    return { valid: false, error: 'Featured must be a boolean' }
  }
  return { valid: true }
}
