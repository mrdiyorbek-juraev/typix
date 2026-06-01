import { describe, expect, it, vi } from 'vitest'
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from 'lexical'
import { createTypix } from '../../editor/create'
import { withTypixMeta } from '../../extension'

describe('createTypix lifecycle', () => {
  it('fires inline onBeforeCreate synchronously before Lexical is built', () => {
    const order: string[] = []
    createTypix({
      extensions: [],
      onBeforeCreate: () => order.push('beforeCreate'),
      onCreate: () => order.push('create'),
    })
    expect(order).toEqual(['beforeCreate', 'create'])
  })

  it('fires inline onCreate after construction', () => {
    const spy = vi.fn()
    const editor = createTypix({
      extensions: [],
      onCreate: spy,
    })
    expect(spy).toHaveBeenCalledOnce()
    expect(spy).toHaveBeenCalledWith({ editor })
  })

  it('runs v5 extension onCreate / storage hooks', () => {
    const initStorage = vi.fn(() => ({ value: 1 }))
    const onCreate = vi.fn()
    const ext = withTypixMeta(defineExtension({ name: 'lifecycle-demo' }), {
      storage: initStorage,
      onCreate,
    })

    const editor = createTypix({ extensions: [ext] })
    expect(initStorage).toHaveBeenCalledOnce()
    expect(onCreate).toHaveBeenCalledOnce()
    expect((onCreate.mock.calls[0]![0] as { storage: { value: number } }).storage.value).toBe(1)
    expect(editor.storage(ext)).toEqual({ value: 1 })
  })

  it('runs v5 extension onDestroy on destroy()', () => {
    const onDestroy = vi.fn()
    const ext = withTypixMeta(defineExtension({ name: 'destroy-demo' }), {
      storage: () => ({ alive: true }),
      onDestroy,
    })
    const editor = createTypix({ extensions: [ext] })
    editor.destroy()
    expect(onDestroy).toHaveBeenCalledOnce()
  })
})

describe('TypixEditor event fan-out', () => {
  it('emits update and contentUpdate when nodes change', () => {
    const editor = createTypix({ extensions: [] })
    const update = vi.fn()
    const contentUpdate = vi.fn()
    editor.on('update', update)
    editor.on('contentUpdate', contentUpdate)

    editor.lexical.update(() => {
      const root = $getRoot()
      const p = $createParagraphNode()
      p.append($createTextNode('hello'))
      root.append(p)
    }, { discrete: true })

    expect(update).toHaveBeenCalled()
    expect(contentUpdate).toHaveBeenCalled()
  })

  it('emits transaction with full Lexical payload', () => {
    const editor = createTypix({ extensions: [] })
    const transaction = vi.fn()
    editor.on('transaction', transaction)

    editor.lexical.update(() => {
      $getRoot().append($createParagraphNode())
    }, { discrete: true })

    expect(transaction).toHaveBeenCalled()
    const payload = transaction.mock.calls[0]![0] as {
      editorState: unknown
      prevEditorState: unknown
      dirtyElements: Map<string, boolean>
      dirtyLeaves: Set<string>
      tags: Set<string>
    }
    expect(payload.editorState).toBeDefined()
    expect(payload.prevEditorState).toBeDefined()
    expect(payload.dirtyElements).toBeInstanceOf(Map)
    expect(payload.dirtyLeaves).toBeInstanceOf(Set)
    expect(payload.tags).toBeInstanceOf(Set)
  })

  it('on/off subscription is symmetric', () => {
    const editor = createTypix({ extensions: [] })
    const listener = vi.fn()
    editor.on('update', listener)
    editor.off('update', listener)
    editor.lexical.update(() => {
      $getRoot().append($createParagraphNode())
    }, { discrete: true })
    expect(listener).not.toHaveBeenCalled()
  })

  it('destroy emits the destroy event', () => {
    const editor = createTypix({ extensions: [] })
    const onDestroy = vi.fn()
    editor.on('destroy', onDestroy)
    editor.destroy()
    expect(onDestroy).toHaveBeenCalledOnce()
  })
})
