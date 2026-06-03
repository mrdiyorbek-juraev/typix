import type { EditorState, ElementNode, LexicalNode } from 'lexical'
import type { TypixEditorInstance, CreateTypixOptions } from './editor'

// ─────────────────────────────────────────────
// Event map
// ─────────────────────────────────────────────

export type TypixEventMap = {
    /** Fires synchronously before the underlying Lexical editor is constructed. */
    beforeCreate: { options: CreateTypixOptions }
    /** Fires after the editor instance is constructed, before initial content. */
    create: { editor: TypixEditorInstance }
    /** Fires after every Lexical update (selection-only included). */
    update: { editor: TypixEditorInstance; editorState: EditorState }
    /** Fires only when nodes change (excludes selection-only updates). */
    contentUpdate: { editor: TypixEditorInstance; editorState: EditorState }
    /** Fires when selection moves without other content changing. */
    selectionChange: { editor: TypixEditorInstance; editorState: EditorState }
    /** Lowest-level event — fires once per Lexical update with full payload. */
    transaction: {
        editor: TypixEditorInstance
        editorState: EditorState
        prevEditorState: EditorState
        dirtyElements: Map<string, boolean>
        dirtyLeaves: Set<string>
        tags: Set<string>
    }
    /** Fires when editor gains focus. */
    focus: { editor: TypixEditorInstance }
    /** Fires when editor loses focus. */
    blur: { editor: TypixEditorInstance }
    /** Fires when editor is destroyed. */
    destroy: { editor: TypixEditorInstance }
    /** Fires when editable state changes. */
    editableChange: { editor: TypixEditorInstance; editable: boolean }
}

export type TypixEventName = keyof TypixEventMap

export type TypixEventListener<TEvent extends TypixEventName> = (
    payload: TypixEventMap[TEvent],
) => void

// Re-export Lexical types referenced in payloads (so adapters don't need
// to import from 'lexical' directly when typing listeners).
export type { EditorState, ElementNode, LexicalNode }
