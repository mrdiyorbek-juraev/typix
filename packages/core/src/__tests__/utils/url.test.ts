import { describe, expect, it } from 'vitest'
import { sanitizeUrl, validateUrl } from '../../utils/url'

describe('sanitizeUrl', () => {
  it.each([
    ['https://example.com'],
    ['http://example.com/path?q=1'],
    ['mailto:user@example.com'],
    ['tel:+1234567890'],
    ['sms:+1234567890'],
  ])('returns supported URL as-is: %s', (url) => {
    expect(sanitizeUrl(url)).toBe(url)
  })

  it.each([
    ['javascript:alert(1)'],
    ['data:text/html,<h1>hi</h1>'],
    ['vbscript:msgbox(1)'],
    ['ftp://example.com'],
  ])('returns about:blank for unsupported protocol: %s', (url) => {
    expect(sanitizeUrl(url)).toBe('about:blank')
  })

  it.each([
    [''],
    ['not-a-url'],
    ['/relative/path'],
    ['just some text with spaces'],
  ])('returns invalid URL as-is (parse error): %s', (url) => {
    expect(sanitizeUrl(url)).toBe(url)
  })
})

describe('validateUrl', () => {
  it('allows "https://" as a special placeholder', () => {
    expect(validateUrl('https://')).toBe(true)
  })

  it.each([
    ['http://example.com'],
    ['https://example.com/path?query=1&foo=bar'],
    ['mailto:user@example.com'],
    ['tel:+1234567890'],
    ['sms:+1234567890'],
    ['www.example.com'],
    ['www.example.co.uk/path'],
  ])('validates valid URL: %s', (url) => {
    expect(validateUrl(url)).toBe(true)
  })

  it.each([
    ['javascript:alert(1)'],
    [''],
    ['not-a-url'],
    ['ftp://example.com'],
    ['data:text/html,hi'],
    ['//example.com'],
  ])('rejects invalid URL: %s', (url) => {
    expect(validateUrl(url)).toBe(false)
  })
})
