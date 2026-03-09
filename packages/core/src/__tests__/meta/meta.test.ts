import { describe, expect, it, vi } from 'vitest'
import type { AnyLexicalExtension, LexicalCommand } from 'lexical'
import {
  registerTypixMeta,
  getTypixMeta,
  resolveTypixMeta,
  mergeTypixMeta,
  typixExtension,
  registerExtensionOutput,
  getExtensionOutput,
} from '../../meta'

import type { LexicalEditor } from 'lexical'

// Lightweight stand-in for AnyLexicalExtension in tests
const mockExt = () => ({}) as AnyLexicalExtension
const mockEditor = () => ({}) as LexicalEditor
const mockCmd = (id: string) => ({ type: id }) as unknown as LexicalCommand<unknown>

// ── registerTypixMeta + getTypixMeta ────────────────────────────────────────

describe('registerTypixMeta / getTypixMeta', () => {
  it('round-trips metadata on an extension', () => {
    const ext = mockExt()
    const meta = { commands: { toggle: mockCmd('TOGGLE') } }
    registerTypixMeta(ext, meta)
    expect(getTypixMeta(ext)).toBe(meta)
  })

  it('returns undefined for unregistered extensions', () => {
    expect(getTypixMeta(mockExt())).toBeUndefined()
  })
})

// ── resolveTypixMeta ────────────────────────────────────────────────────────

describe('resolveTypixMeta', () => {
  it('works with a direct extension', () => {
    const ext = mockExt()
    const meta = { commands: { bold: mockCmd('BOLD') } }
    registerTypixMeta(ext, meta)
    expect(resolveTypixMeta(ext)).toBe(meta)
  })

  it('works with a configExtension tuple [ext, ...configs]', () => {
    const ext = mockExt()
    const meta = { commands: { italic: mockCmd('ITALIC') } }
    registerTypixMeta(ext, meta)
    const tuple: [AnyLexicalExtension, ...unknown[]] = [ext, { some: 'config' }]
    expect(resolveTypixMeta(tuple)).toBe(meta)
  })
})

// ── mergeTypixMeta ──────────────────────────────────────────────────────────

describe('mergeTypixMeta', () => {
  it('merges commands and shortcuts from multiple extensions', () => {
    const ext1 = mockExt()
    const ext2 = mockExt()
    const cmd1 = mockCmd('BOLD')
    const cmd2 = mockCmd('ITALIC')
    const shortcut1 = { key: 'b', modifiers: ['mod' as const], command: 'toggleBold' }
    const shortcut2 = { key: 'i', modifiers: ['mod' as const], command: 'toggleItalic' }

    registerTypixMeta(ext1, { commands: { toggleBold: cmd1 }, shortcuts: [shortcut1] })
    registerTypixMeta(ext2, { commands: { toggleItalic: cmd2 }, shortcuts: [shortcut2] })

    const merged = mergeTypixMeta([ext1, ext2])
    expect(merged.commands).toEqual({ toggleBold: cmd1, toggleItalic: cmd2 })
    expect(merged.shortcuts).toEqual([shortcut1, shortcut2])
  })

  it('warns on duplicate command names and keeps the first', () => {
    const ext1 = mockExt()
    const ext2 = mockExt()
    const cmd1 = mockCmd('CMD_A')
    const cmd2 = mockCmd('CMD_B')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    registerTypixMeta(ext1, { commands: { toggle: cmd1 } })
    registerTypixMeta(ext2, { commands: { toggle: cmd2 } })

    const merged = mergeTypixMeta([ext1, ext2])
    expect(warn).toHaveBeenCalledWith(
      '[Typix] Duplicate command name "toggle" during metadata merge.',
    )
    expect(merged.commands!.toggle).toBe(cmd1)
    warn.mockRestore()
  })

  it('skips extensions without metadata', () => {
    const withMeta = mockExt()
    const withoutMeta = mockExt()
    registerTypixMeta(withMeta, { commands: { bold: mockCmd('BOLD') } })

    const merged = mergeTypixMeta([withoutMeta, withMeta])
    expect(Object.keys(merged.commands!)).toEqual(['bold'])
    expect(merged.shortcuts).toEqual([])
  })
})

// ── typixExtension ──────────────────────────────────────────────────────────

describe('typixExtension', () => {
  it('returns the same extension object (identity)', () => {
    const ext = mockExt()
    expect(typixExtension(ext)).toBe(ext)
  })

  it('attaches metadata readable via getTypixMeta', () => {
    const ext = mockExt()
    const meta = { commands: { underline: mockCmd('UNDERLINE') } }
    typixExtension(ext, meta)
    expect(getTypixMeta(ext)).toBe(meta)
  })

  it('works without metadata (no-op)', () => {
    const ext = mockExt()
    typixExtension(ext)
    expect(getTypixMeta(ext)).toBeUndefined()
  })
})

// ── registerExtensionOutput / getExtensionOutput ─────────────────────────────

describe('registerExtensionOutput / getExtensionOutput', () => {
  it('round-trips output for a given editor + extension pair', () => {
    const editor = mockEditor()
    const ext = mockExt()
    const output = { value: 42 }
    registerExtensionOutput(editor, ext, output)
    expect(getExtensionOutput(editor, ext)).toBe(output)
  })

  it('returns undefined when no output registered for editor', () => {
    const editor = mockEditor()
    const ext = mockExt()
    expect(getExtensionOutput(editor, ext)).toBeUndefined()
  })

  it('returns undefined when output registered for different editor', () => {
    const editor1 = mockEditor()
    const editor2 = mockEditor()
    const ext = mockExt()
    registerExtensionOutput(editor1, ext, { x: 1 })
    expect(getExtensionOutput(editor2, ext)).toBeUndefined()
  })

  it('returns undefined when output registered for different extension', () => {
    const editor = mockEditor()
    const ext1 = mockExt()
    const ext2 = mockExt()
    registerExtensionOutput(editor, ext1, { x: 1 })
    expect(getExtensionOutput(editor, ext2)).toBeUndefined()
  })

  it('supports multiple extensions per editor independently', () => {
    const editor = mockEditor()
    const ext1 = mockExt()
    const ext2 = mockExt()
    const output1 = { a: 1 }
    const output2 = { b: 2 }
    registerExtensionOutput(editor, ext1, output1)
    registerExtensionOutput(editor, ext2, output2)
    expect(getExtensionOutput(editor, ext1)).toBe(output1)
    expect(getExtensionOutput(editor, ext2)).toBe(output2)
  })

  it('supports multiple editors per extension independently', () => {
    const editor1 = mockEditor()
    const editor2 = mockEditor()
    const ext = mockExt()
    const output1 = { i: 1 }
    const output2 = { i: 2 }
    registerExtensionOutput(editor1, ext, output1)
    registerExtensionOutput(editor2, ext, output2)
    expect(getExtensionOutput(editor1, ext)).toBe(output1)
    expect(getExtensionOutput(editor2, ext)).toBe(output2)
  })
})
