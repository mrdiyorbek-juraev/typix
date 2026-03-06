import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  defineTypixExtension,
  mergeTypixConfig,
  ExtensionRegistry,
} from '../../editor/extension'
import type { AnyLexicalExtension, TypixExtensionDefinition } from '../../types'

// Lightweight stand-in for AnyLexicalExtension in tests that don't exercise Lexical behaviour
const mockTypix = {} as AnyLexicalExtension

// ── defineTypixExtension ────────────────────────────────────────────────────

describe('defineTypixExtension', () => {
  it('is an identity function — returns the exact same object', () => {
    const def: TypixExtensionDefinition = { name: 'bold', typix: mockTypix }
    expect(defineTypixExtension(def)).toBe(def)
  })

  it('preserves all fields on the definition', () => {
    const shortcut = { key: 'b', modifiers: ['mod' as const], command: 'toggleBold' }
    const def = defineTypixExtension({
      name: 'bold',
      typix: mockTypix,
      config: { disabled: false },
      shortcuts: [shortcut],
    })
    expect(def.name).toBe('bold')
    expect(def.shortcuts).toContainEqual(shortcut)
  })
})

// ── mergeTypixConfig ────────────────────────────────────────────────────────

describe('mergeTypixConfig', () => {
  it('merges override values into base', () => {
    expect(mergeTypixConfig({ a: 1, b: 2 }, { b: 99 })).toEqual({ a: 1, b: 99 })
  })

  it('returns a new object without mutating the base', () => {
    const base = { a: 1, b: 2 }
    const result = mergeTypixConfig(base, { b: 99 })
    expect(base.b).toBe(2)
    expect(result).not.toBe(base)
  })

  it('handles an empty override gracefully', () => {
    expect(mergeTypixConfig({ a: 1 }, {})).toEqual({ a: 1 })
  })

  it('adds new keys from the override', () => {
    const result = mergeTypixConfig({ a: 1 } as Record<string, number>, { b: 2 } as any)
    expect(result).toEqual({ a: 1, b: 2 })
  })
})

// ── ExtensionRegistry ───────────────────────────────────────────────────────

describe('ExtensionRegistry', () => {
  let registry: ExtensionRegistry

  beforeEach(() => {
    registry = new ExtensionRegistry()
  })

  function makeExt(
    name: string,
    overrides: Partial<TypixExtensionDefinition> = {},
  ): TypixExtensionDefinition {
    return { name, typix: mockTypix, ...overrides }
  }

  // ── register ──────────────────────────────────────────────────────────

  describe('register', () => {
    it('registers an extension', () => {
      registry.register(makeExt('bold'))
      expect(registry.hasExtension('bold')).toBe(true)
    })

    it('warns and skips a duplicate extension', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      registry.register(makeExt('bold'))
      registry.register(makeExt('bold'))
      expect(registry.getAllExtensions()).toHaveLength(1)
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('registered commands receive their extension config via closure', () => {
      const config = { level: 2 }
      let receivedLevel: unknown
      registry.register(makeExt('heading', {
        config,
        commands: {
          setHeading: (cfg) => () => {
            receivedLevel = cfg.level
            return true
          },
        },
      }))
      registry.getCommand('setHeading')!({} as any, undefined)
      expect(receivedLevel).toBe(2)
    })

    it('commands without config receive an empty config object', () => {
      let receivedConfig: unknown
      registry.register(makeExt('bold', {
        commands: {
          toggleBold: (cfg) => () => {
            receivedConfig = cfg
            return true
          },
        },
      }))
      registry.getCommand('toggleBold')!({} as any, undefined)
      expect(receivedConfig).toEqual({})
    })

    it('warns on duplicate command names across different extensions', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const cmd = vi.fn(() => vi.fn(() => true))
      registry.register(makeExt('bold', { commands: { toggle: cmd } }))
      registry.register(makeExt('italic', { commands: { toggle: cmd } }))
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('collects shortcuts from registered extensions', () => {
      const shortcut = { key: 'b', modifiers: ['mod' as const], command: 'toggleBold' }
      registry.register(makeExt('bold', { shortcuts: [shortcut] }))
      expect(registry.getAllShortcuts()).toContainEqual(shortcut)
    })

    it('accumulates shortcuts from multiple extensions', () => {
      const s1 = { key: 'b', modifiers: ['mod' as const], command: 'bold' }
      const s2 = { key: 'i', modifiers: ['mod' as const], command: 'italic' }
      registry.register(makeExt('bold', { shortcuts: [s1] }))
      registry.register(makeExt('italic', { shortcuts: [s2] }))
      expect(registry.getAllShortcuts()).toHaveLength(2)
    })
  })

  // ── hasExtension / getExtension ────────────────────────────────────────

  describe('hasExtension', () => {
    it('returns true for a registered extension', () => {
      registry.register(makeExt('bold'))
      expect(registry.hasExtension('bold')).toBe(true)
    })

    it('returns false for an unregistered extension', () => {
      expect(registry.hasExtension('nonexistent')).toBe(false)
    })
  })

  describe('getExtension', () => {
    it('returns the registered extension definition', () => {
      const ext = makeExt('bold')
      registry.register(ext)
      expect(registry.getExtension('bold')).toBe(ext)
    })

    it('returns undefined for an unregistered extension', () => {
      expect(registry.getExtension('unknown')).toBeUndefined()
    })
  })

  // ── getCommand ─────────────────────────────────────────────────────────

  describe('getCommand', () => {
    it('returns a callable handler for a registered command', () => {
      let called = false
      registry.register(makeExt('bold', {
        commands: { toggleBold: () => () => { called = true; return true } },
      }))
      const handler = registry.getCommand('toggleBold')
      expect(handler).toBeDefined()
      handler!({} as any, undefined)
      expect(called).toBe(true)
    })

    it('returns undefined for an unregistered command', () => {
      expect(registry.getCommand('nonexistent')).toBeUndefined()
    })
  })

  // ── getAllCommands ──────────────────────────────────────────────────────

  describe('getAllCommands', () => {
    it('returns all registered commands by name', () => {
      registry.register(makeExt('bold', { commands: { toggleBold: () => () => true } }))
      registry.register(makeExt('italic', { commands: { toggleItalic: () => () => true } }))
      const commands = registry.getAllCommands()
      expect(commands.has('toggleBold')).toBe(true)
      expect(commands.has('toggleItalic')).toBe(true)
    })

    it('returns a copy — mutating it does not affect the registry', () => {
      registry.register(makeExt('bold', { commands: { toggleBold: () => () => true } }))
      const commands = registry.getAllCommands()
      commands.delete('toggleBold')
      expect(registry.getCommand('toggleBold')).toBeDefined()
    })
  })

  // ── getAllExtensions ────────────────────────────────────────────────────

  describe('getAllExtensions', () => {
    it('returns all registered extensions in insertion order', () => {
      const ext1 = makeExt('bold')
      const ext2 = makeExt('italic')
      registry.register(ext1)
      registry.register(ext2)
      expect(registry.getAllExtensions()).toEqual([ext1, ext2])
    })
  })

  // ── getLexicalExtensions ────────────────────────────────────────────────

  describe('getLexicalExtensions', () => {
    it('returns the typix field from each registered extension', () => {
      const typix1 = { _id: 'a' } as unknown as AnyLexicalExtension
      const typix2 = { _id: 'b' } as unknown as AnyLexicalExtension
      registry.register({ name: 'ext1', typix: typix1 })
      registry.register({ name: 'ext2', typix: typix2 })
      expect(registry.getLexicalExtensions()).toEqual([typix1, typix2])
    })
  })
})
