import { describe, it, expect } from 'vitest'
import { sanitizeUrl } from '../sanitize'

describe('sanitizeUrl', () => {
  it('allows https URLs', () => {
    expect(sanitizeUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
  })

  it('allows http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com/')
  })

  it('allows mailto URLs', () => {
    expect(sanitizeUrl('mailto:hello@example.com')).toBe('mailto:hello@example.com')
  })

  it('blocks javascript: protocol', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#')
  })

  it('blocks data: protocol', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#')
  })

  it('blocks vbscript: protocol', () => {
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('#')
  })
})
