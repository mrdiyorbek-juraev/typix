import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createHeadlessEditor } from '@lexical/headless'
import type { LexicalEditor } from 'lexical'
import { createChainBuilder, createCanChainBuilder } from '../../editor/chain'
import { ExtensionRegistry } from '../../editor/extension'
import type { AnyLexicalExtension, ChainBuilder, CanChainBuilder } from '../../types'

const mockTypix = {} as AnyLexicalExtension

function makeEditor(): LexicalEditor {
  return createHeadlessEditor({
    namespace: 'test',
    onError: (err) => { throw err },
  })
}

describe('createChainBuilder', () => {
  let editor: LexicalEditor
  let registry: ExtensionRegistry
  let chain: ChainBuilder

  beforeEach(() => {
    editor = makeEditor()
    registry = new ExtensionRegistry()
    chain = createChainBuilder(editor, registry)
  })

  // ── Chainability ──────────────────────────────────────────────────────

  describe('built-in methods return the proxy (chainable)', () => {
    it('focus() returns itself', () => expect(chain.focus()).toBe(chain))
    it('blur() returns itself', () => expect(chain.blur()).toBe(chain))
    it('clearContent() returns itself', () => expect(chain.clearContent()).toBe(chain))
    it('toggleMark() returns itself', () => expect(chain.toggleMark('bold')).toBe(chain))
    it('toggleBlock() returns itself', () => expect(chain.toggleBlock('heading')).toBe(chain))
  })

  it('proxies unknown method calls and returns itself', () => {
    const result = (chain as any).customCommand('arg1')
    expect(result).toBe(chain)
  })

  // ── run() ─────────────────────────────────────────────────────────────

  describe('run()', () => {
    it('returns true for an empty queue', () => {
      expect(chain.run()).toBe(true)
    })

    it('executes a registered extension command and returns true', () => {
      let executed = false
      registry.register({
        name: 'ext',
        typix: mockTypix,
        commands: { myCmd: () => () => { executed = true; return true } },
      })
      ;(chain as any).myCmd()
      expect(chain.run()).toBe(true)
      expect(executed).toBe(true)
    })

    it('returns false when a command handler returns false', () => {
      const handler = vi.fn(() => false)
      registry.register({ name: 'ext', typix: mockTypix, commands: { myCmd: () => handler } })
      ;(chain as any).myCmd()
      expect(chain.run()).toBe(false)
    })

    it('returns false when at least one command in the queue fails', () => {
      const pass = vi.fn(() => true)
      const fail = vi.fn(() => false)
      registry.register({
        name: 'ext',
        typix: mockTypix,
        commands: { pass: () => pass, fail: () => fail },
      })
      ;(chain as any).pass()
      ;(chain as any).fail()
      expect(chain.run()).toBe(false)
    })

    it('clears the queue after execution', () => {
      let callCount = 0
      registry.register({
        name: 'ext',
        typix: mockTypix,
        commands: { doIt: () => () => { callCount++; return true } },
      })
      ;(chain as any).doIt()
      chain.run()
      chain.run() // second run — queue was already cleared
      expect(callCount).toBe(1)
    })

    it('executes queued commands in order', () => {
      const order: string[] = []
      registry.register({
        name: 'ext-a',
        typix: mockTypix,
        commands: { a: () => () => { order.push('a'); return true } },
      })
      registry.register({
        name: 'ext-b',
        typix: mockTypix,
        commands: { b: () => () => { order.push('b'); return true } },
      })
      ;(chain as any).a().b()
      chain.run()
      expect(order).toEqual(['a', 'b'])
    })

    it('falls back to built-in commands (e.g. undo returns true)', () => {
      // 'undo' is a Lexical built-in handled by executeBuiltinCommand
      ;(chain as any).undo()
      expect(chain.run()).toBe(true)
    })
  })

  // ── Fluent chaining ───────────────────────────────────────────────────

  it('supports a full fluent chain without intermediate variable', () => {
    let toggled = false
    registry.register({
      name: 'ext',
      typix: mockTypix,
      commands: { toggle: () => () => { toggled = true; return true } },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(createChainBuilder(editor, registry) as any).clearContent().toggle().run()
    expect(toggled).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════
// createCanChainBuilder
// ══════════════════════════════════════════════════════════════════════

describe('createCanChainBuilder', () => {
  let editor: LexicalEditor
  let registry: ExtensionRegistry
  let can: CanChainBuilder

  beforeEach(() => {
    editor = makeEditor()
    registry = new ExtensionRegistry()
    can = createCanChainBuilder(editor, registry)
  })

  // ── run() basics ──────────────────────────────────────────────────

  it('returns true for an empty queue', () => {
    expect(can.run()).toBe(true)
  })

  it('returns true when extension command is registered', () => {
    registry.register({
      name: 'ext',
      typix: mockTypix,
      commands: { myCmd: () => () => true },
    })
    expect((can as any).myCmd().run()).toBe(true)
  })

  it('returns false when command is not registered', () => {
    expect((can as any).nonexistent().run()).toBe(false)
  })

  // ── Builtin commands ──────────────────────────────────────────────

  it('returns true for builtin focus()', () => {
    expect(can.focus().run()).toBe(true)
  })

  it('returns true for builtin blur()', () => {
    expect(can.blur().run()).toBe(true)
  })

  it('returns true for builtin setContent()', () => {
    expect(can.setContent('test').run()).toBe(true)
  })

  it('returns true for builtin clearContent()', () => {
    expect(can.clearContent().run()).toBe(true)
  })

  it('returns true for builtin undo', () => {
    expect((can as any).undo().run()).toBe(true)
  })

  it('returns true for builtin redo', () => {
    expect((can as any).redo().run()).toBe(true)
  })

  // ── toggleMark ────────────────────────────────────────────────────

  it('returns true for toggleMark with a known mark', () => {
    expect(can.toggleMark('bold').run()).toBe(true)
  })

  it('returns false for toggleMark with an unknown mark', () => {
    expect(can.toggleMark('nonexistent').run()).toBe(false)
  })

  // ── toggleBlock ───────────────────────────────────────────────────

  it('returns false for toggleBlock via builtin (requires extension)', () => {
    expect(can.toggleBlock('heading').run()).toBe(false)
  })

  it('returns true for toggleBlock when extension handles it', () => {
    registry.register({
      name: 'heading-ext',
      typix: mockTypix,
      commands: { toggleBlock: () => () => true },
    })
    expect(can.toggleBlock('heading').run()).toBe(true)
  })

  // ── Mixed chains ──────────────────────────────────────────────────

  it('returns true when all commands in a mixed chain exist', () => {
    registry.register({
      name: 'ext',
      typix: mockTypix,
      commands: { customCmd: () => () => true },
    })
    expect((can as any).focus().customCmd().run()).toBe(true)
  })

  it('returns false when one command in a mixed chain does not exist', () => {
    expect((can as any).focus().nonexistent().run()).toBe(false)
  })

  // ── No side effects ───────────────────────────────────────────────

  it('does NOT execute command handlers', () => {
    const handler = vi.fn(() => true)
    registry.register({
      name: 'ext',
      typix: mockTypix,
      commands: { myCmd: () => handler },
    })
    ;(can as any).myCmd().run()
    expect(handler).not.toHaveBeenCalled()
  })

  // ── Chainability ──────────────────────────────────────────────────

  it('built-in methods return the proxy (chainable)', () => {
    expect(can.focus()).toBe(can)
    expect(can.blur()).toBe(can)
    expect(can.clearContent()).toBe(can)
    expect(can.toggleMark('bold')).toBe(can)
    expect(can.toggleBlock('heading')).toBe(can)
  })

  it('proxies unknown method calls and returns itself', () => {
    expect((can as any).someCommand('arg')).toBe(can)
  })

  it('clears the queue after run()', () => {
    ;(can as any).nonexistent()
    can.run() // false, clears queue
    expect(can.run()).toBe(true) // empty queue → true
  })
})
