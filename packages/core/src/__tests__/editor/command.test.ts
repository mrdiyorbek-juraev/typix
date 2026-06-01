import { describe, expect, it, vi } from 'vitest'
import { createHeadlessEditor } from '@lexical/headless'
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  type LexicalEditor,
} from 'lexical'
import {
  executeBuiltinCommand,
  getEditorText,
  isEditorEmpty,
  isMarkActive,
} from '../../editor/command'

function makeEditor(): LexicalEditor {
  return createHeadlessEditor({
    namespace: 'test',
    onError: (err) => { throw err },
  })
}

// ── isEditorEmpty ───────────────────────────────────────────────────────────

describe('isEditorEmpty', () => {
  it('returns true for a fresh editor (single empty paragraph)', () => {
    expect(isEditorEmpty(makeEditor())).toBe(true)
  })

  it('returns false after content is added', () => {
    const editor = makeEditor()
    editor.update(
      () => {
        const root = $getRoot()
        root.clear()
        const p = $createParagraphNode()
        p.append($createTextNode('hello'))
        root.append(p)
      },
      { discrete: true },
    )
    expect(isEditorEmpty(editor)).toBe(false)
  })
})

// ── getEditorText ───────────────────────────────────────────────────────────

describe('getEditorText', () => {
  it('returns empty string for a fresh editor', () => {
    expect(getEditorText(makeEditor())).toBe('')
  })

  it('returns text content after inserting text', () => {
    const editor = makeEditor()
    editor.update(
      () => {
        const root = $getRoot()
        root.clear()
        const p = $createParagraphNode()
        p.append($createTextNode('hello world'))
        root.append(p)
      },
      { discrete: true },
    )
    expect(getEditorText(editor)).toBe('hello world')
  })
})

// ── isMarkActive ────────────────────────────────────────────────────────────

describe('isMarkActive', () => {
  it('returns false when there is no selection', () => {
    expect(isMarkActive(makeEditor(), 'bold')).toBe(false)
  })

  it('returns false for an unknown mark name', () => {
    expect(isMarkActive(makeEditor(), 'not-a-real-mark')).toBe(false)
  })
})

// ── executeBuiltinCommand ───────────────────────────────────────────────────

describe('executeBuiltinCommand', () => {
  it('returns false for an unrecognised command', () => {
    expect(executeBuiltinCommand(makeEditor(), 'nonexistent', [])).toBe(false)
  })

  it('handles "undo" and returns true', () => {
    expect(executeBuiltinCommand(makeEditor(), 'undo', [])).toBe(true)
  })

  it('handles "redo" and returns true', () => {
    expect(executeBuiltinCommand(makeEditor(), 'redo', [])).toBe(true)
  })

  it('handles "clearContent" and returns true', () => {
    expect(executeBuiltinCommand(makeEditor(), 'clearContent', [])).toBe(true)
  })

  it('handles "toggleMark" with a known mark and returns true', () => {
    expect(executeBuiltinCommand(makeEditor(), 'toggleMark', ['bold'])).toBe(true)
  })

  it.each(['italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript', 'highlight'])(
    'handles "toggleMark" with mark "%s" and returns true',
    (mark) => {
      expect(executeBuiltinCommand(makeEditor(), 'toggleMark', [mark])).toBe(true)
    },
  )

  it('handles "toggleMark" with unknown mark name and returns false', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(executeBuiltinCommand(makeEditor(), 'toggleMark', ['not-a-mark'])).toBe(false)
    warn.mockRestore()
  })

  it('"toggleBlock" is no longer a built-in (v5): returns false silently', () => {
    expect(executeBuiltinCommand(makeEditor(), 'toggleBlock', ['heading'])).toBe(false)
  })

  // Note: 'blur' calls editor.getRootElement() which is unsupported in headless mode.
  // It is tested only in a DOM environment (e.g. the playground integration tests).
})
