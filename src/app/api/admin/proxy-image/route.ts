import { NextResponse } from 'next/server'
import { isAllowedProxyUrl } from '@/lib/validation'

const PROXY_TIMEOUT = 10_000
const MAX_RESPONSE_SIZE = 15 * 1024 * 1024 // 15 MB

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  if (!isAllowedProxyUrl(url)) {
    return NextResponse.json(
      { error: 'URL not allowed. Only Firebase Storage URLs are permitted.' },
      { status: 403 }
    )
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT)

    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch' }, { status: res.status })
    }

    const contentLength = res.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > MAX_RESPONSE_SIZE) {
      return NextResponse.json({ error: 'Response too large' }, { status: 413 })
    }

    const buffer = await res.arrayBuffer()
    if (buffer.byteLength > MAX_RESPONSE_SIZE) {
      return NextResponse.json({ error: 'Response too large' }, { status: 413 })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out' }, { status: 504 })
    }
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }
}
