import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createHeadlessEditor } from '@lexical/headless'
import { createCommand } from 'lexical'
import type { LexicalEditor, AnyLexicalExtension } from 'lexical'
import { createChainBuilder, createCanChainBuilder } from '../../editor/chain'
import { ExtensionRegistry } from '../../editor/extension'
import { registerTypixMeta } from '../../meta'
import type { ChainBuilder, CanChainBuilder } from '../../types'

const mockExt = () => ({}) as AnyLexicalExtension

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

    it('dispatches a registered Lexical command and returns true', () => {
      const ext = mockExt()
      const MY_CMD = createCommand<void>('TYPIX_MY_CMD_TEST')
      registerTypixMeta(ext, { commands: { myCmd: MY_CMD } })
      registry.register(ext)

      const spy = vi.spyOn(editor, 'dispatchCommand').mockReturnValue(true)
      ;(chain as any).myCmd()
      expect(chain.run()).toBe(true)
      expect(spy).toHaveBeenCalledWith(MY_CMD, undefined)
      spy.mockRestore()
    })

    it('returns false when dispatchCommand returns false', () => {
      const ext = mockExt()
      const MY_CMD = createCommand<void>('TYPIX_FAIL_CMD')
      registerTypixMeta(ext, { commands: { myCmd: MY_CMD } })
      registry.register(ext)

      const spy = vi.spyOn(editor, 'dispatchCommand').mockReturnValue(false)
      ;(chain as any).myCmd()
      expect(chain.run()).toBe(false)
      spy.mockRestore()
    })

    it('returns false when at least one command in the queue fails', () => {
      const ext = mockExt()
      const PASS_CMD = createCommand<void>('TYPIX_PASS_CMD')
      const FAIL_CMD = createCommand<void>('TYPIX_FAIL_CMD2')
      registerTypixMeta(ext, { commands: { pass: PASS_CMD, fail: FAIL_CMD } })
      registry.register(ext)

      const spy = vi.spyOn(editor, 'dispatchCommand')
        .mockImplementation((cmd: any) => cmd === PASS_CMD ? true : false)
      ;(chain as any).pass()
      ;(chain as any).fail()
      expect(chain.run()).toBe(false)
      spy.mockRestore()
    })

    it('passes args[0] as payload to dispatchCommand', () => {
      const ext = mockExt()
      const CMD = createCommand<string>('TYPIX_PAYLOAD_CMD')
      registerTypixMeta(ext, { commands: { doIt: CMD } })
      registry.register(ext)

      const spy = vi.spyOn(editor, 'dispatchCommand').mockReturnValue(true)
      ;(chain as any).doIt('myPayload')
      chain.run()
      expect(spy).toHaveBeenCalledWith(CMD, 'myPayload')
      spy.mockRestore()
    })

    it('clears the queue after execution', () => {
      const ext = mockExt()
      const CMD = createCommand<void>('TYPIX_ONCE_CMD')
      registerTypixMeta(ext, { commands: { doIt: CMD } })
      registry.register(ext)

      const spy = vi.spyOn(editor, 'dispatchCommand').mockReturnValue(true)
      ;(chain as any).doIt()
      chain.run()
      chain.run() // second run — queue was already cleared
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockRestore()
    })

    it('executes queued commands in order', () => {
      const extA = mockExt()
      const extB = mockExt()
      const CMD_A = createCommand<void>('TYPIX_ORDER_A')
      const CMD_B = createCommand<void>('TYPIX_ORDER_B')
      registerTypixMeta(extA, { commands: { a: CMD_A } })
      registerTypixMeta(extB, { commands: { b: CMD_B } })
      registry.register(extA)
      registry.register(extB)

      const order: string[] = []
      vi.spyOn(editor, 'dispatchCommand').mockImplementation((cmd: any) => {
        if (cmd === CMD_A) order.push('a')
        if (cmd === CMD_B) order.push('b')
        return true
      })
      ;(chain as any).a().b()
      chain.run()
      expect(order).toEqual(['a', 'b'])
      vi.restoreAllMocks()
    })

    it('falls back to built-in commands (e.g. undo returns true)', () => {
      // 'undo' is a Lexical built-in handled by executeBuiltinCommand
      ;(chain as any).undo()
      expect(chain.run()).toBe(true)
    })
  })

  // ── Fluent chaining ───────────────────────────────────────────────────

  it('supports a full fluent chain without intermediate variable', () => {
    const ext = mockExt()
    const CMD = createCommand<void>('TYPIX_FLUENT_CMD')
    registerTypixMeta(ext, { commands: { toggle: CMD } })
    registry.register(ext)

    const spy = vi.spyOn(editor, 'dispatchCommand').mockReturnValue(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(createChainBuilder(editor, registry) as any).clearContent().toggle().run()
    expect(spy).toHaveBeenCalledWith(CMD, undefined)
    spy.mockRestore()
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
    const ext = mockExt()
    const CMD = createCommand<void>('TYPIX_CAN_CMD')
    registerTypixMeta(ext, { commands: { myCmd: CMD } })
    registry.register(ext)
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
    const ext = mockExt()
    const CMD = createCommand<void>('TYPIX_TOGGLE_BLOCK_CMD')
    registerTypixMeta(ext, { commands: { toggleBlock: CMD } })
    registry.register(ext)
    expect(can.toggleBlock('heading').run()).toBe(true)
  })

  // ── Mixed chains ──────────────────────────────────────────────────

  it('returns true when all commands in a mixed chain exist', () => {
    const ext = mockExt()
    const CMD = createCommand<void>('TYPIX_MIXED_CMD')
    registerTypixMeta(ext, { commands: { customCmd: CMD } })
    registry.register(ext)
    expect((can as any).focus().customCmd().run()).toBe(true)
  })

  it('returns false when one command in a mixed chain does not exist', () => {
    expect((can as any).focus().nonexistent().run()).toBe(false)
  })

  // ── No side effects ───────────────────────────────────────────────

  it('does NOT call editor.dispatchCommand', () => {
    const ext = mockExt()
    const CMD = createCommand<void>('TYPIX_NO_SIDE_EFFECT_CMD')
    registerTypixMeta(ext, { commands: { myCmd: CMD } })
    registry.register(ext)

    const spy = vi.spyOn(editor, 'dispatchCommand')
    ;(can as any).myCmd().run()
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
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
