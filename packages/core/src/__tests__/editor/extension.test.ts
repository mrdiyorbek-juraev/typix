import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineExtension } from 'lexical'
import { ExtensionRegistry, withTypixMeta } from '../../extension'

// ── ExtensionRegistry ───────────────────────────────────────────────────────

describe('ExtensionRegistry', () => {
  let registry: ExtensionRegistry

  beforeEach(() => {
    registry = new ExtensionRegistry()
  })

  // ── register ──────────────────────────────────────────────────────────

  describe('register', () => {
    it('registers an extension without metadata — no crash', () => {
      const ext = defineExtension({ name: 'bare' })
      expect(() => registry.register(ext)).not.toThrow()
      expect(registry.getAllExtensions()).toHaveLength(1)
    })

    it('stores commands from withTypixMeta', () => {
      const fn = () => true
      const ext = withTypixMeta(defineExtension({ name: 'cmd' }), {
        commands: () => ({ myCmd: () => () => fn() }),
      })
      registry.register(ext)
      expect(registry.hasCommand('myCmd')).toBe(true)
      expect(registry.getCommandFactory('myCmd')).toBeDefined()
    })

    it('stores shortcuts from withTypixMeta', () => {
      const shortcut = {
        key: 'b',
        modifiers: ['mod' as const],
        command: 'toggleBold',
      }
      const ext = withTypixMeta(defineExtension({ name: 'sc' }), {
        shortcuts: [shortcut],
      })
      registry.register(ext)
      expect(registry.getAllShortcuts()).toContainEqual(shortcut)
    })

    it('accumulates shortcuts from multiple extensions', () => {
      const s1 = { key: 'b', modifiers: ['mod' as const], command: 'bold' }
      const s2 = { key: 'i', modifiers: ['mod' as const], command: 'italic' }
      registry.register(
        withTypixMeta(defineExtension({ name: 'a' }), { shortcuts: [s1] }),
      )
      registry.register(
        withTypixMeta(defineExtension({ name: 'b' }), { shortcuts: [s2] }),
      )
      expect(registry.getAllShortcuts()).toHaveLength(2)
    })

    it('warns on duplicate command names and keeps the first', () => {
      const first = withTypixMeta(defineExtension({ name: 'first' }), {
        commands: () => ({ toggle: () => () => true }),
      })
      const second = withTypixMeta(defineExtension({ name: 'second' }), {
        commands: () => ({ toggle: () => () => false }),
      })
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      registry.register(first)
      registry.register(second)
      expect(warn).toHaveBeenCalledWith('[Typix] Command "toggle" already registered.')
      warn.mockRestore()
    })

    it('multiple extensions register independently without conflict', () => {
      const a = withTypixMeta(defineExtension({ name: 'a' }), {
        commands: () => ({ bold: () => () => true }),
      })
      const b = withTypixMeta(defineExtension({ name: 'b' }), {
        commands: () => ({ italic: () => () => true }),
      })
      registry.register(a)
      registry.register(b)
      expect(registry.hasCommand('bold')).toBe(true)
      expect(registry.hasCommand('italic')).toBe(true)
    })
  })

  // ── hasCommand / getCommandFactory ─────────────────────────────────────

  describe('lookup', () => {
    it('hasCommand returns true for registered names', () => {
      const ext = withTypixMeta(defineExtension({ name: 'lookup' }), {
        commands: () => ({ ping: () => () => true }),
      })
      registry.register(ext)
      expect(registry.hasCommand('ping')).toBe(true)
    })

    it('hasCommand returns false for unregistered names', () => {
      expect(registry.hasCommand('nonexistent')).toBe(false)
    })

    it('getCommandFactory returns undefined for unregistered names', () => {
      expect(registry.getCommandFactory('nope')).toBeUndefined()
    })
  })

  // ── getAllExtensions ────────────────────────────────────────────────────

  describe('getAllExtensions', () => {
    it('returns all registered extensions in insertion order', () => {
      const a = defineExtension({ name: 'a' })
      const b = defineExtension({ name: 'b' })
      registry.register(a)
      registry.register(b)
      const all = registry.getAllExtensions()
      expect(all[0]).toBe(a)
      expect(all[1]).toBe(b)
      expect(all).toHaveLength(2)
    })

    it('returns a copy — mutating it does not affect the registry', () => {
      registry.register(defineExtension({ name: 'x' }))
      const copy = registry.getAllExtensions()
      copy.splice(0, 1)
      expect(registry.getAllExtensions()).toHaveLength(1)
    })
  })

  // ── getAllShortcuts ─────────────────────────────────────────────────────

  describe('getAllShortcuts', () => {
    it('returns a copy — mutating it does not affect the registry', () => {
      const shortcut = {
        key: 'b',
        modifiers: ['mod' as const],
        command: 'bold',
      }
      registry.register(
        withTypixMeta(defineExtension({ name: 'sc' }), {
          shortcuts: [shortcut],
        }),
      )
      const copy = registry.getAllShortcuts()
      copy.splice(0, 1)
      expect(registry.getAllShortcuts()).toHaveLength(1)
    })

    it('returns empty array when no shortcuts registered', () => {
      expect(registry.getAllShortcuts()).toEqual([])
    })
  })
})
