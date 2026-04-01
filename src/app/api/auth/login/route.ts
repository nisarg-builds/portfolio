import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { isNonEmptyString } from '@/lib/validation'

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const { success } = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)
  if (!success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again in 15 minutes.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { password } = body as Record<string, unknown>
  if (!isNonEmptyString(password)) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 })
  }

  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !safeCompare(password, expected)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin-token', process.env.ADMIN_TOKEN_VALUE!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
