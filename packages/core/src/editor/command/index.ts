import {
    $getRoot,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    FORMAT_TEXT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    type LexicalEditor,
    type TextFormatType,
} from 'lexical'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import type { SerializedContent } from '../../types';
import { BlockType } from '../constants';
import { $getNearestNodeOfType } from '@lexical/utils';
import { $isListNode, ListNode } from '@lexical/list';
import { $isQuoteNode } from '@lexical/rich-text';
import { $isCodeNode } from '@lexical/code';

/**
 * Map of Typix mark names → Lexical TextFormatType
 */
const MARK_TO_FORMAT: Record<string, TextFormatType> = {
    bold: 'bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'strikethrough',
    code: 'code',
    subscript: 'subscript',
    superscript: 'superscript',
    highlight: 'highlight',
}

/**
 * Execute a built-in Typix command against a Lexical editor.
 * Returns true if the command was handled, false otherwise.
 */
export function executeBuiltinCommand(
    editor: LexicalEditor,
    name: string,
    args: unknown[],
): boolean {
    switch (name) {
        case 'focus': {
            const position = (args[0] as string) ?? 'end'
            focusEditor(editor, position as 'start' | 'end' | 'all')
            return true
        }

        case 'blur': {
            editor.getRootElement()?.blur()
            return true
        }

        case 'toggleMark': {
            const markName = args[0] as string
            const format = MARK_TO_FORMAT[markName]
            if (!format) {
                console.warn(`[Typix] Unknown mark: "${markName}"`)
                return false
            }
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
            return true
        }

        case 'setContent': {
            const content = args[0] as SerializedContent | string
            setEditorContent(editor, content)
            return true
        }

        case 'clearContent': {
            editor.update(() => {
                const root = $getRoot()
                root.clear()
                const paragraph = $createParagraphNode()
                root.append(paragraph)
            })
            return true
        }

        case 'undo': {
            editor.dispatchCommand(UNDO_COMMAND, undefined)
            return true
        }

        case 'redo': {
            editor.dispatchCommand(REDO_COMMAND, undefined)
            return true
        }

        default:
            return false
    }
}

/**
 * Check if a mark is currently active at the selection.
 */
export function isMarkActive(
    editor: LexicalEditor,
    markName: string,
): boolean {
    const format = MARK_TO_FORMAT[markName]
    if (!format) return false

    let isActive = false
    editor.getEditorState().read(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return
        isActive = selection.hasFormat(format)
    })
    return isActive
}

/**
 * Get the plain text content of the editor.
 */
export function getEditorText(editor: LexicalEditor): string {
    let text = ''
    editor.getEditorState().read(() => {
        text = $getRoot().getTextContent()
    })
    return text
}

/**
 * Get the HTML representation of the editor content.
 */
export function getEditorHTML(editor: LexicalEditor): string {
    let html = ''
    editor.getEditorState().read(() => {
        html = $generateHtmlFromNodes(editor, null)
    })
    return html
}

/**
 * Set editor content from a JSON EditorState or HTML string.
 */
export function setEditorContent(
    editor: LexicalEditor,
    content: SerializedContent | string,
): void {
    if (typeof content === 'string') {
        editor.update(() => {
            const parser = new DOMParser()
            const dom = parser.parseFromString(content, 'text/html')
            const nodes = $generateNodesFromDOM(editor, dom)
            const root = $getRoot()
            root.clear()
            root.append(...nodes)
        })
    } else {
        const editorState = editor.parseEditorState(JSON.stringify(content))
        editor.setEditorState(editorState)
    }
}

/**
 * Focus the editor at a specific position.
 */
function focusEditor(
    editor: LexicalEditor,
    position: 'start' | 'end' | 'all',
): void {
    editor.focus(() => {
        editor.update(() => {
            const existing = $getSelection()
            if ($isRangeSelection(existing) && !existing.isCollapsed()) return

            const root = $getRoot()

            if (position === 'start') {
                const firstChild = root.getFirstChild()
                if (firstChild) firstChild.selectStart()
            } else if (position === 'end') {
                const lastChild = root.getLastChild()
                if (lastChild) lastChild.selectEnd()
            } else if (position === 'all') {
                root.select(0, root.getChildrenSize())
            }
        })
    })
}

/**
 * Check if the editor content is empty (only an empty paragraph).
 */
export function isEditorEmpty(editor: LexicalEditor): boolean {
    let empty = true
    editor.getEditorState().read(() => {
        const root = $getRoot()
        const children = root.getChildren()
        if (children.length > 1) {
            empty = false
            return
        }
        if (children.length === 1) {
            const child = children[0]
            if (child.getTextContent().length > 0) {
                empty = false
            }
        }
    })
    return empty
}

/**
 * Check if a block type is currently active.
 */
export function isBlockActive(
    editor: LexicalEditor,
    blockType: BlockType,
): boolean {
    return editor.getEditorState().read(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return false

        const anchorNode = selection.anchor.getNode()
        const element = anchorNode.getTopLevelElement()
        if (!element) return false
        const elementType = element.getType()

        if (blockType === 'bullet' || blockType === 'number' || blockType === 'check') {
            const listNode = $getNearestNodeOfType(element, ListNode)
            if (!(listNode && $isListNode(listNode))) return false
            const listTagType = listNode.getListType()
            if (blockType === 'bullet') return listTagType === 'bullet'
            if (blockType === 'number') return listTagType === 'number'
            if (blockType === 'check') return listTagType === 'check'
            return false
        }

        if (blockType.startsWith('h')) {
            if (elementType !== 'heading') return false
            const tag = (element as unknown as { getTag: () => string }).getTag()
            return tag === blockType
        }

        if (blockType === 'quote') return $isQuoteNode(element)
        if (blockType === 'code') return $isCodeNode(element)
        if (blockType === 'paragraph') return elementType === 'paragraph'

        return false
    })
}
