import { describe, expectTypeOf, it } from 'vitest'
import type {
  BuiltinMarkName,
  CanChainBuilder,
  ChainBuilder,
  SerializedContent,
  TypixEditorInstance,
} from '../../types'

// These tests use the no-argument generic form of expectTypeOf because the
// values they reason about (chain, editor, etc.) are declare-const types only
// — accessing them at runtime would crash. Generic expectTypeOf<T>() is a pure
// type-system check.

describe('ChainBuilder inference (built-ins)', () => {
  it('focus accepts an optional position and returns ChainBuilder', () => {
    expectTypeOf<ChainBuilder['focus']>().returns.toEqualTypeOf<ChainBuilder>()
    expectTypeOf<Parameters<ChainBuilder['focus']>>().toEqualTypeOf<
      [position?: 'start' | 'end' | 'all']
    >()
  })

  it('blur / clearContent / undo / redo all return ChainBuilder', () => {
    expectTypeOf<ChainBuilder['blur']>().returns.toEqualTypeOf<ChainBuilder>()
    expectTypeOf<
      ChainBuilder['clearContent']
    >().returns.toEqualTypeOf<ChainBuilder>()
    expectTypeOf<ChainBuilder['undo']>().returns.toEqualTypeOf<ChainBuilder>()
    expectTypeOf<ChainBuilder['redo']>().returns.toEqualTypeOf<ChainBuilder>()
  })

  it('setContent accepts SerializedContent or string', () => {
    expectTypeOf<Parameters<ChainBuilder['setContent']>>().toEqualTypeOf<
      [content: SerializedContent | string]
    >()
    expectTypeOf<
      ChainBuilder['setContent']
    >().returns.toEqualTypeOf<ChainBuilder>()
  })

  it('toggleMark only accepts built-in mark names', () => {
    expectTypeOf<Parameters<ChainBuilder['toggleMark']>>().toEqualTypeOf<
      [name: BuiltinMarkName, attrs?: Record<string, unknown>]
    >()
    expectTypeOf<
      ChainBuilder['toggleMark']
    >().returns.toEqualTypeOf<ChainBuilder>()
  })

  it('run() returns boolean', () => {
    expectTypeOf<ChainBuilder['run']>().returns.toEqualTypeOf<boolean>()
  })

  it('editor.chain() returns ChainBuilder', () => {
    expectTypeOf<
      TypixEditorInstance['chain']
    >().returns.toEqualTypeOf<ChainBuilder>()
  })
})

describe('CanChainBuilder mirrors ChainBuilder, returning CanChainBuilder', () => {
  it('built-in methods return CanChainBuilder', () => {
    expectTypeOf<
      CanChainBuilder['focus']
    >().returns.toEqualTypeOf<CanChainBuilder>()
    expectTypeOf<
      CanChainBuilder['blur']
    >().returns.toEqualTypeOf<CanChainBuilder>()
    expectTypeOf<
      CanChainBuilder['toggleMark']
    >().returns.toEqualTypeOf<CanChainBuilder>()
  })

  it('run() returns boolean', () => {
    expectTypeOf<CanChainBuilder['run']>().returns.toEqualTypeOf<boolean>()
  })

  it('editor.can() returns CanChainBuilder', () => {
    expectTypeOf<
      TypixEditorInstance['can']
    >().returns.toEqualTypeOf<CanChainBuilder>()
  })
})
