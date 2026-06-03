import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createHeadlessEditor } from '@lexical/headless'
import { defineExtension, type LexicalEditor } from 'lexical'
import { createCanChainBuilder, createChainBuilder } from '../../editor/chain'
import { ExtensionRegistry, withTypixMeta } from '../../extension'
import type { CanChainBuilder, ChainBuilder, CommandFn } from '../../types'

function makeEditor(): LexicalEditor {
  return createHeadlessEditor({
    namespace: 'test',
    onError: (err) => {
      throw err
    },
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
    it('clearContent() returns itself', () =>
      expect(chain.clearContent()).toBe(chain))
    it('undo() returns itself', () => expect(chain.undo()).toBe(chain))
    it('redo() returns itself', () => expect(chain.redo()).toBe(chain))
    it('toggleMark() returns itself', () =>
      expect(chain.toggleMark('bold')).toBe(chain))
  })

  it('Proxy still queues unknown method calls at runtime (type system enforces names)', () => {
    // The TypeScript surface no longer permits unknown methods, but the
    // Proxy continues to queue them so extension-registered commands work.
    const result = (chain as any).customCommand('arg1')
    expect(result).toBe(chain)
  })

  // ── run() ─────────────────────────────────────────────────────────────

  describe('run()', () => {
    it('returns true for an empty queue', () => {
      expect(chain.run()).toBe(true)
    })

    it('invokes a registered command factory and returns true', () => {
      const inner = vi.fn<CommandFn>(() => true)
      const factory = vi.fn(() => inner)
      const ext = withTypixMeta(defineExtension({ name: 'cmd' }), {
        commands: () => ({ myCmd: factory }),
      })
      registry.register(ext)
      ;(chain as any).myCmd()
      expect(chain.run()).toBe(true)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(inner).toHaveBeenCalledWith(editor)
    })

    it('returns false when the command function returns false', () => {
      const ext = withTypixMeta(defineExtension({ name: 'cmd-fail' }), {
        commands: () => ({ myCmd: () => () => false }),
      })
      registry.register(ext)
      ;(chain as any).myCmd()
      expect(chain.run()).toBe(false)
    })

    it('returns false when at least one command in the queue fails', () => {
      const ext = withTypixMeta(defineExtension({ name: 'mixed' }), {
        commands: () => ({
          pass: () => () => true,
          fail: () => () => false,
        }),
      })
      registry.register(ext)
      ;(chain as any).pass()
      ;(chain as any).fail()
      expect(chain.run()).toBe(false)
    })

    it('forwards args to the command factory', () => {
      const factory = vi.fn((_payload: string) => () => true)
      const ext = withTypixMeta(defineExtension({ name: 'payload' }), {
        commands: () => ({ doIt: factory }),
      })
      registry.register(ext)
      ;(chain as any).doIt('myPayload')
      chain.run()
      expect(factory).toHaveBeenCalledWith('myPayload')
    })

    it('clears the queue after execution', () => {
      const inner = vi.fn<CommandFn>(() => true)
      const ext = withTypixMeta(defineExtension({ name: 'once' }), {
        commands: () => ({ doIt: () => inner }),
      })
      registry.register(ext)
      ;(chain as any).doIt()
      chain.run()
      chain.run() // second run — queue was already cleared
      expect(inner).toHaveBeenCalledTimes(1)
    })

    it('executes queued commands in order', () => {
      const order: string[] = []
      const extA = withTypixMeta(defineExtension({ name: 'a' }), {
        commands: () => ({
          a: () => () => {
            order.push('a')
            return true
          },
        }),
      })
      const extB = withTypixMeta(defineExtension({ name: 'b' }), {
        commands: () => ({
          b: () => () => {
            order.push('b')
            return true
          },
        }),
      })
      registry.register(extA)
      registry.register(extB)
      ;(chain as any).a().b()
      chain.run()
      expect(order).toEqual(['a', 'b'])
    })

    it('falls back to built-in commands (e.g. undo returns true)', () => {
      chain.undo()
      expect(chain.run()).toBe(true)
    })
  })

  // ── Fluent chaining ───────────────────────────────────────────────────

  it('supports a full fluent chain without intermediate variable', () => {
    const inner = vi.fn<CommandFn>(() => true)
    const ext = withTypixMeta(defineExtension({ name: 'fluent' }), {
      commands: () => ({ toggle: () => inner }),
    })
    registry.register(ext)
    ;(createChainBuilder(editor, registry) as any)
      .clearContent()
      .toggle()
      .run()
    expect(inner).toHaveBeenCalledWith(editor)
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

  it('returns true for an empty queue', () => {
    expect(can.run()).toBe(true)
  })

  it('returns true when extension command is registered', () => {
    const ext = withTypixMeta(defineExtension({ name: 'can-cmd' }), {
      commands: () => ({ myCmd: () => () => true }),
    })
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
    expect(can.undo().run()).toBe(true)
  })

  it('returns true for builtin redo', () => {
    expect(can.redo().run()).toBe(true)
  })

  // ── toggleMark ────────────────────────────────────────────────────

  it('returns true for toggleMark with a known mark', () => {
    expect(can.toggleMark('bold').run()).toBe(true)
  })

  it('returns false for toggleMark with an unknown mark', () => {
    // Cast through any because BuiltinMarkName excludes unknown names by design.
    expect((can.toggleMark as any)('nonexistent').run()).toBe(false)
  })

  // ── toggleBlock no longer built-in ────────────────────────────────

  it('toggleBlock is no longer a built-in — only available via extension', () => {
    expect((can as any).toggleBlock('heading').run()).toBe(false)
  })

  it('an extension can still expose a "toggleBlock" command if it wants to', () => {
    const ext = withTypixMeta(defineExtension({ name: 'toggle-block' }), {
      commands: () => ({ toggleBlock: () => () => true }),
    })
    registry.register(ext)
    expect((can as any).toggleBlock('heading').run()).toBe(true)
  })

  // ── Mixed chains ──────────────────────────────────────────────────

  it('returns true when all commands in a mixed chain exist', () => {
    const ext = withTypixMeta(defineExtension({ name: 'mix' }), {
      commands: () => ({ customCmd: () => () => true }),
    })
    registry.register(ext)
    expect((can as any).focus().customCmd().run()).toBe(true)
  })

  it('returns false when one command in a mixed chain does not exist', () => {
    expect((can as any).focus().nonexistent().run()).toBe(false)
  })

  // ── No side effects ───────────────────────────────────────────────

  it('does NOT invoke the command factory or its inner fn', () => {
    const inner = vi.fn<CommandFn>(() => true)
    const factory = vi.fn(() => inner)
    const ext = withTypixMeta(defineExtension({ name: 'no-side' }), {
      commands: () => ({ myCmd: factory }),
    })
    registry.register(ext)
    ;(can as any).myCmd().run()
    // Note: registry eagerly evaluates the `commands` factory once at register
    // time to enumerate keys, so `factory` is the inner per-command factory,
    // which `can()` should never call.
    expect(factory).not.toHaveBeenCalled()
    expect(inner).not.toHaveBeenCalled()
  })

  // ── Chainability ──────────────────────────────────────────────────

  it('built-in methods return the proxy (chainable)', () => {
    expect(can.focus()).toBe(can)
    expect(can.blur()).toBe(can)
    expect(can.clearContent()).toBe(can)
    expect(can.toggleMark('bold')).toBe(can)
    expect(can.undo()).toBe(can)
    expect(can.redo()).toBe(can)
  })

  it('Proxy still queues unknown method calls at runtime', () => {
    expect((can as any).someCommand('arg')).toBe(can)
  })

  it('clears the queue after run()', () => {
    ;(can as any).nonexistent()
    can.run() // false, clears queue
    expect(can.run()).toBe(true) // empty queue → true
  })
})
