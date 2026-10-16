import { describe, expect, it } from 'vitest'
import { sanitizeProjectData, validateProjectData } from '../validation'

const base = { title: 'Isle', slug: 'isle', link: '/isle' }

describe('validateProjectData: logo', () => {
  it.each([
    ['an empty string, which clears the logo', ''],
    ['an uploaded image', 'https://storage.googleapis.com/bucket/projects/logos/isle.png'],
    ['a site path', '/images/projects/isle-logo.png'],
  ])('accepts %s', (_, logo) => {
    expect(validateProjectData({ ...base, logo }).valid).toBe(true)
  })

  it.each([
    ['a host next/image does not allow', 'https://example.com/isle.png'],
    ['a protocol-relative URL', '//example.com/isle.png'],
    ['a script URL', 'javascript:alert(1)'],
    ['a non-string', 42],
  ])('rejects %s', (_, logo) => {
    expect(validateProjectData({ ...base, logo }).valid).toBe(false)
  })

  it('keeps the logo when it sanitizes the payload', () => {
    expect(sanitizeProjectData({ ...base, logo: '/x.png' })).toHaveProperty('logo', '/x.png')
  })
})

describe('validateProjectData: link', () => {
  it('accepts an empty link, so a private project can still be edited', () => {
    expect(validateProjectData({ ...base, link: '' }).valid).toBe(true)
  })

  it('rejects a link that is not a URL or a site path', () => {
    expect(validateProjectData({ ...base, link: 'javascript:alert(1)' }).valid).toBe(false)
  })
})

describe('validateProjectData: download', () => {
  it.each(['', '/downloads/Isle.dmg', 'https://github.com/x/y/releases/latest/download/y.dmg'])(
    'accepts %j',
    (download) => {
      expect(validateProjectData({ ...base, download }).valid).toBe(true)
    },
  )

  it('rejects a script URL', () => {
    expect(validateProjectData({ ...base, download: 'javascript:alert(1)' }).valid).toBe(false)
  })
})
