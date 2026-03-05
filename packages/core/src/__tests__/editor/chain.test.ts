import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createHeadlessEditor } from '@lexical/headless'
import type { LexicalEditor } from 'lexical'
import { createChainBuilder } from '../../editor/chain'
import { ExtensionRegistry } from '../../editor/extension'
import type { AnyLexicalExtension, ChainBuilder } from '../../types'

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
      const handler = vi.fn(() => true)
      registry.register({ name: 'ext', typix: mockTypix, commands: { myCmd: () => handler } })
      ;(chain as any).myCmd()
      expect(chain.run()).toBe(true)
      expect(handler).toHaveBeenCalledOnce()
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
      const handler = vi.fn(() => true)
      registry.register({ name: 'ext', typix: mockTypix, commands: { doIt: () => handler } })
      ;(chain as any).doIt()
      chain.run()
      chain.run() // second run — queue was already cleared
      expect(handler).toHaveBeenCalledOnce()
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
    const handler = vi.fn(() => true)
    registry.register({ name: 'ext', typix: mockTypix, commands: { toggle: () => handler } })
    const result = createChainBuilder(editor, registry)
      .clearContent()
      .toggleMark('bold')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(createChainBuilder(editor, registry) as any).toggle().run()
    expect(handler).toHaveBeenCalledOnce()
  })
})
