import { describe, expect, it, vi } from 'vitest'
import { defineExtension } from 'lexical'
import {
  ExtensionRegistry,
  TYPIX_META,
  getTypixExtensionMeta,
  withTypixMeta,
} from '../../extension'

describe('withTypixMeta', () => {
  it('returns the SAME extension object (stable identity)', () => {
    const lexExt = defineExtension({ name: 'demo' })
    const branded = withTypixMeta(lexExt, {})
    expect(branded).toBe(lexExt)
  })

  it('stamps TYPIX_META on the extension', () => {
    const ext = withTypixMeta(defineExtension({ name: 'demo' }), {})
    expect((ext as any)[TYPIX_META]).toBeDefined()
    expect((ext as any)[TYPIX_META].name).toBe('demo')
  })

  it('stores commands factory accessible via getTypixExtensionMeta', () => {
    const ext = withTypixMeta(defineExtension({ name: 'demo' }), {
      commands: () => ({
        ping: () => () => true,
      }),
    })
    const meta = getTypixExtensionMeta(ext)
    expect(meta).toBeDefined()
    expect(typeof meta?.commands).toBe('function')
    const record = meta?.commands?.()
    expect(record).toHaveProperty('ping')
  })

  it('defaults shortcuts to empty array when omitted', () => {
    const ext = withTypixMeta(defineExtension({ name: 'a' }), {})
    expect(getTypixExtensionMeta(ext)?.shortcuts).toEqual([])
  })

  it('preserves provided shortcuts', () => {
    const ext = withTypixMeta(defineExtension({ name: 'b' }), {
      shortcuts: [{ key: 'b', modifiers: ['mod'], command: 'toggleBold' }],
    })
    expect(getTypixExtensionMeta(ext)?.shortcuts).toHaveLength(1)
  })

  it('the inner defineExtension result IS a valid native Lexical extension', () => {
    const ext = withTypixMeta(
      defineExtension({ name: 'demo', dependencies: [] }),
      { commands: () => ({ ping: () => () => true }) },
    )
    // Lexical extensions expose `name`. Without the wrapper hiding it,
    // pure-Lexical consumers can read it normally.
    expect((ext as unknown as { name: string }).name).toBe('demo')
  })

  it('returns undefined from getTypixExtensionMeta for plain Lexical extensions', () => {
    const plain = defineExtension({ name: 'unbranded' })
    expect(getTypixExtensionMeta(plain)).toBeUndefined()
  })

  it('registry picks up v5 commands by name', () => {
    const ext = withTypixMeta(defineExtension({ name: 'demo' }), {
      commands: () => ({
        ping: () => () => true,
        pong: () => () => true,
      }),
    })
    const registry = new ExtensionRegistry()
    registry.register(ext)
    expect(registry.hasCommand('ping')).toBe(true)
    expect(registry.hasCommand('pong')).toBe(true)
    expect(registry.hasCommand('absent')).toBe(false)
  })

  it('registry surfaces v5 shortcuts', () => {
    const ext = withTypixMeta(defineExtension({ name: 'demo' }), {
      shortcuts: [
        { key: 'b', modifiers: ['mod'], command: 'toggleBold' },
        { key: 'i', modifiers: ['mod'], command: 'toggleItalic' },
      ],
    })
    const registry = new ExtensionRegistry()
    registry.register(ext)
    expect(registry.getAllShortcuts()).toHaveLength(2)
  })

  it('warns on duplicate v5 command names', () => {
    const a = withTypixMeta(defineExtension({ name: 'a' }), {
      commands: () => ({ same: () => () => true }),
    })
    const b = withTypixMeta(defineExtension({ name: 'b' }), {
      commands: () => ({ same: () => () => true }),
    })
    const registry = new ExtensionRegistry()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    registry.register(a)
    registry.register(b)
    expect(warn).toHaveBeenCalledWith('[Typix] Command "same" already registered.')
    warn.mockRestore()
  })

  it('exposes lifecycle metas only when storage / onCreate / onDestroy provided', () => {
    const bare = withTypixMeta(defineExtension({ name: 'bare' }), {})
    const withHook = withTypixMeta(defineExtension({ name: 'live' }), {
      onCreate: () => {},
    })
    const registry = new ExtensionRegistry()
    registry.register(bare)
    registry.register(withHook)
    const metas = registry.getLifecycleMetas()
    expect(metas).toHaveLength(1)
    expect(metas[0]!.meta.name).toBe('live')
  })
})
