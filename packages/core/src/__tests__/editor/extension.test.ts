import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCommand } from 'lexical'
import type { AnyLexicalExtension } from 'lexical'
import { ExtensionRegistry } from '../../extension'
import { registerTypixMeta } from '../../extension/compat'

// Lightweight stand-in for AnyLexicalExtension — plain objects are valid WeakMap keys
const mockExt = () => ({}) as AnyLexicalExtension

// ── ExtensionRegistry ───────────────────────────────────────────────────────

describe('ExtensionRegistry', () => {
  let registry: ExtensionRegistry

  beforeEach(() => {
    registry = new ExtensionRegistry()
  })

  // ── register ──────────────────────────────────────────────────────────

  describe('register', () => {
    it('registers an extension without metadata — no crash', () => {
      const ext = mockExt()
      expect(() => registry.register(ext)).not.toThrow()
      expect(registry.getAllExtensions()).toHaveLength(1)
    })

    it('stores commands from TypixMeta', () => {
      const ext = mockExt()
      const cmd = createCommand<void>('TEST_CMD_STORE')
      registerTypixMeta(ext, { commands: { myCmd: cmd } })
      registry.register(ext)
      expect(registry.getLexicalCommand('myCmd')).toBe(cmd)
    })

    it('stores shortcuts from TypixMeta', () => {
      const ext = mockExt()
      const shortcut = { key: 'b', modifiers: ['mod' as const], command: 'toggleBold' }
      registerTypixMeta(ext, { shortcuts: [shortcut] })
      registry.register(ext)
      expect(registry.getAllShortcuts()).toContainEqual(shortcut)
    })

    it('accumulates shortcuts from multiple extensions', () => {
      const ext1 = mockExt()
      const ext2 = mockExt()
      const s1 = { key: 'b', modifiers: ['mod' as const], command: 'bold' }
      const s2 = { key: 'i', modifiers: ['mod' as const], command: 'italic' }
      registerTypixMeta(ext1, { shortcuts: [s1] })
      registerTypixMeta(ext2, { shortcuts: [s2] })
      registry.register(ext1)
      registry.register(ext2)
      expect(registry.getAllShortcuts()).toHaveLength(2)
    })

    it('warns on duplicate command names and keeps the first', () => {
      const ext1 = mockExt()
      const ext2 = mockExt()
      const cmd1 = createCommand<void>('CMD_FIRST')
      const cmd2 = createCommand<void>('CMD_SECOND')
      registerTypixMeta(ext1, { commands: { toggle: cmd1 } })
      registerTypixMeta(ext2, { commands: { toggle: cmd2 } })
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      registry.register(ext1)
      registry.register(ext2)
      expect(warn).toHaveBeenCalledWith('[Typix] Command "toggle" already registered.')
      expect(registry.getLexicalCommand('toggle')).toBe(cmd1)
      warn.mockRestore()
    })

    it('multiple extensions register independently without conflict', () => {
      const ext1 = mockExt()
      const ext2 = mockExt()
      const cmd1 = createCommand<void>('CMD_BOLD')
      const cmd2 = createCommand<void>('CMD_ITALIC')
      registerTypixMeta(ext1, { commands: { bold: cmd1 } })
      registerTypixMeta(ext2, { commands: { italic: cmd2 } })
      registry.register(ext1)
      registry.register(ext2)
      expect(registry.getLexicalCommand('bold')).toBe(cmd1)
      expect(registry.getLexicalCommand('italic')).toBe(cmd2)
    })
  })

  // ── getLexicalCommand / hasCommand ─────────────────────────────────────

  describe('getLexicalCommand', () => {
    it('returns the LexicalCommand for a registered command name', () => {
      const ext = mockExt()
      const cmd = createCommand<string>('TEST_GET_CMD')
      registerTypixMeta(ext, { commands: { myCmd: cmd } })
      registry.register(ext)
      expect(registry.getLexicalCommand('myCmd')).toBe(cmd)
    })

    it('returns undefined for an unregistered command name', () => {
      expect(registry.getLexicalCommand('nonexistent')).toBeUndefined()
    })
  })

  describe('hasCommand', () => {
    it('returns true for a registered command', () => {
      const ext = mockExt()
      const cmd = createCommand<void>('TEST_HAS_CMD')
      registerTypixMeta(ext, { commands: { toggle: cmd } })
      registry.register(ext)
      expect(registry.hasCommand('toggle')).toBe(true)
    })

    it('returns false for an unregistered command', () => {
      expect(registry.hasCommand('nonexistent')).toBe(false)
    })
  })

  // ── getAllExtensions ────────────────────────────────────────────────────

  describe('getAllExtensions', () => {
    it('returns all registered extensions in insertion order', () => {
      const ext1 = mockExt()
      const ext2 = mockExt()
      registry.register(ext1)
      registry.register(ext2)
      const all = registry.getAllExtensions()
      expect(all[0]).toBe(ext1)
      expect(all[1]).toBe(ext2)
      expect(all).toHaveLength(2)
    })

    it('returns a copy — mutating it does not affect the registry', () => {
      const ext = mockExt()
      registry.register(ext)
      const copy = registry.getAllExtensions()
      copy.splice(0, 1)
      expect(registry.getAllExtensions()).toHaveLength(1)
    })
  })

  // ── getAllShortcuts ─────────────────────────────────────────────────────

  describe('getAllShortcuts', () => {
    it('returns a copy — mutating it does not affect the registry', () => {
      const ext = mockExt()
      const shortcut = { key: 'b', modifiers: ['mod' as const], command: 'bold' }
      registerTypixMeta(ext, { shortcuts: [shortcut] })
      registry.register(ext)
      const copy = registry.getAllShortcuts()
      copy.splice(0, 1)
      expect(registry.getAllShortcuts()).toHaveLength(1)
    })

    it('returns empty array when no shortcuts registered', () => {
      expect(registry.getAllShortcuts()).toEqual([])
    })
  })
})
