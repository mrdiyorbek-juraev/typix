import { describe, expect, it, vi } from 'vitest'
import { createCommand } from 'lexical'
import type { AnyLexicalExtension } from 'lexical'
import { defineExtension } from 'lexical'
import { ExtensionRegistry, withTypixMeta } from '../../extension'
import {
  registerTypixMeta,
  getTypixMeta,
  resolveTypixMeta,
  mergeTypixMeta,
  registerExtensionOutput,
  getExtensionOutput,
  typixExtension,
} from '../../extension/compat'

const mockExt = () => ({}) as AnyLexicalExtension

describe('v4 compatibility shim', () => {
  describe('registerTypixMeta / getTypixMeta', () => {
    it('round-trips metadata via the legacy WeakMap', () => {
      const ext = mockExt()
      const cmd = createCommand<void>('LEGACY_CMD')
      registerTypixMeta(ext, {
        commands: { my: cmd },
        shortcuts: [{ key: 'm', modifiers: ['mod'], command: 'my' }],
      })
      const meta = getTypixMeta(ext)
      expect(meta?.commands?.my).toBe(cmd)
      expect(meta?.shortcuts).toHaveLength(1)
    })
  })

  describe('resolveTypixMeta', () => {
    it('reads metadata from a plain extension', () => {
      const ext = mockExt()
      const cmd = createCommand<void>('RESOLVE_CMD')
      registerTypixMeta(ext, { commands: { foo: cmd } })
      expect(resolveTypixMeta(ext)?.commands?.foo).toBe(cmd)
    })

    it('reads metadata from a configExtension-style tuple ([ext, ...configs])', () => {
      const ext = mockExt()
      const cmd = createCommand<void>('TUPLE_CMD')
      registerTypixMeta(ext, { commands: { bar: cmd } })
      expect(resolveTypixMeta([ext, { foo: 1 }])?.commands?.bar).toBe(cmd)
    })
  })

  describe('mergeTypixMeta', () => {
    it('combines commands and shortcuts across extensions', () => {
      const a = mockExt()
      const b = mockExt()
      const aCmd = createCommand<void>('A')
      const bCmd = createCommand<void>('B')
      registerTypixMeta(a, { commands: { a: aCmd }, shortcuts: [{ key: 'a', modifiers: ['mod'], command: 'a' }] })
      registerTypixMeta(b, { commands: { b: bCmd }, shortcuts: [{ key: 'b', modifiers: ['mod'], command: 'b' }] })
      const merged = mergeTypixMeta([a, b])
      expect(Object.keys(merged.commands ?? {})).toEqual(['a', 'b'])
      expect(merged.shortcuts).toHaveLength(2)
    })

    it('warns on duplicate command names during merge', () => {
      const a = mockExt()
      const b = mockExt()
      registerTypixMeta(a, { commands: { same: createCommand<void>('A') } })
      registerTypixMeta(b, { commands: { same: createCommand<void>('B') } })
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mergeTypixMeta([a, b])
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })
  })

  describe('typixExtension', () => {
    it('returns the extension and stores metadata', () => {
      const ext = mockExt()
      const cmd = createCommand<void>('TX_CMD')
      const result = typixExtension(ext, { commands: { x: cmd } })
      expect(result).toBe(ext)
      expect(getTypixMeta(ext)?.commands?.x).toBe(cmd)
    })
  })

  describe('registerExtensionOutput / getExtensionOutput', () => {
    it('round-trips per-editor output keyed by extension identity', () => {
      const editor = {} as any
      const ext = mockExt()
      registerExtensionOutput(editor, ext, { value: 42 })
      expect(getExtensionOutput<{ value: number }>(editor, ext)?.value).toBe(42)
    })

    it('returns undefined when never registered', () => {
      expect(getExtensionOutput({} as any, mockExt())).toBeUndefined()
    })
  })
})

describe('mixed v4 / v5 registration', () => {
  it('registry registers both extension shapes without conflict', () => {
    const v4 = mockExt()
    const v4Cmd = createCommand<void>('V4_CMD')
    registerTypixMeta(v4, { commands: { v4cmd: v4Cmd } })

    const v5 = withTypixMeta(defineExtension({ name: 'v5' }), {
      commands: () => ({ v5cmd: () => () => true }),
    })

    const registry = new ExtensionRegistry()
    registry.register(v4)
    registry.register(v5)

    expect(registry.hasCommand('v4cmd')).toBe(true)
    expect(registry.hasCommand('v5cmd')).toBe(true)
    expect(registry.getLexicalCommand('v4cmd')).toBe(v4Cmd)
    expect(registry.getCommandFactory('v5cmd')).toBeDefined()
  })

  it('warns when a v5 command name collides with an already-registered v4 command', () => {
    const v4 = mockExt()
    registerTypixMeta(v4, { commands: { same: createCommand<void>('CLASH') } })
    const v5 = withTypixMeta(defineExtension({ name: 'v5' }), {
      commands: () => ({ same: () => () => true }),
    })

    const registry = new ExtensionRegistry()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    registry.register(v4)
    registry.register(v5)
    expect(warn).toHaveBeenCalledWith('[Typix] Command "same" already registered.')
    warn.mockRestore()
  })
})
