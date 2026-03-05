import { describe, expect, it } from 'vitest'
import type { EditorThemeClasses } from 'lexical'
import { getThemeSelector } from '../../utils/theme-selector'

describe('getThemeSelector', () => {
  it('returns a single class selector', () => {
    const theme: EditorThemeClasses = { paragraph: 'typix-paragraph' }
    expect(getThemeSelector(() => theme, 'paragraph')).toBe('.typix-paragraph')
  })

  it('returns multiple class selectors joined by comma', () => {
    const theme: EditorThemeClasses = { paragraph: 'foo bar baz' }
    expect(getThemeSelector(() => theme, 'paragraph')).toBe('.foo,.bar,.baz')
  })

  it('handles extra whitespace between class names', () => {
    const theme: EditorThemeClasses = { paragraph: 'foo   bar' }
    expect(getThemeSelector(() => theme, 'paragraph')).toBe('.foo,.bar')
  })

  it('throws when the theme property is undefined', () => {
    expect(() =>
      getThemeSelector(() => ({} as EditorThemeClasses), 'paragraph'),
    ).toThrow('getThemeClass: required theme property paragraph not defined')
  })

  it('throws when the theme is null', () => {
    expect(() => getThemeSelector(() => null, 'paragraph')).toThrow(
      'getThemeClass: required theme property paragraph not defined',
    )
  })

  it('throws when the theme is undefined', () => {
    expect(() => getThemeSelector(() => undefined, 'paragraph')).toThrow(
      'getThemeClass: required theme property paragraph not defined',
    )
  })
})
