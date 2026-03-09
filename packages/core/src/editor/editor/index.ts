import { $getSelection, $isRangeSelection, type LexicalEditor } from 'lexical'
import type {
    TypixEditorInstance,
    TypixEventName,
    TypixEventListener,
    SerializedContent,
    ChainBuilder,
    CanChainBuilder,
} from '../../types'
import { ExtensionRegistry } from '../extension'
import {
    isMarkActive,
    getEditorText,
    getEditorHTML,
    setEditorContent,
    isEditorEmpty,
    executeBuiltinCommand,
    isBlockActive,
} from '../command'
import { createChainBuilder, createCanChainBuilder } from '../chain'
import { TypixEventEmitter } from '../event'


let _instanceCounter = 0

/**
 * The concrete TypixEditor implementation.
 * Returned by `createTypix()`.
 */
export class TypixEditor implements TypixEditorInstance {
    readonly id: string
    readonly namespace: string

    private _lexical: LexicalEditor
    private _emitter = new TypixEventEmitter()
    private _registry: ExtensionRegistry
    private _mounted = false
    private _disposers: Array<() => void> = []
    private _lexicalDispose?: () => void
    private _currentRoot: HTMLElement | null = null
    private _handleFocus: (() => void) | null = null
    private _handleBlur: (() => void) | null = null

    constructor(
        lexicalEditor: LexicalEditor,
        registry: ExtensionRegistry,
        namespace: string,
        lexicalDispose?: () => void,
    ) {
        _instanceCounter++
        this.id = `typix-${_instanceCounter}`
        this.namespace = namespace
        this._lexical = lexicalEditor
        this._registry = registry
        this._lexicalDispose = lexicalDispose

        this._registerCoreListeners()
    }

    // ─────────────────────────────────────────
    // Lifecycle
    // ─────────────────────────────────────────

    mount(element: HTMLElement): void {
        if (this._mounted) {
            console.warn('[Typix] Editor is already mounted. Call destroy() first.')
            return
        }
        this._lexical.setRootElement(element)
        this._mounted = true
    }

    destroy(): void {
        this._emitter.emit('destroy', { editor: this })
        // Remove DOM focus/blur listeners before unregistering the root listener
        this._removeDomListeners()
        this._disposers.forEach((dispose) => dispose())
        this._disposers = []
        this._lexical.setRootElement(null)
        this._emitter.removeAllListeners()
        this._mounted = false
        this._lexicalDispose?.()
    }

    get isMounted(): boolean {
        return this._mounted
    }

    // ─────────────────────────────────────────
    // Content
    // ─────────────────────────────────────────

    getJSON(): SerializedContent {
        const state = this._lexical.getEditorState()
        return state.toJSON() as unknown as SerializedContent;
    }

    getHTML(): string {
        return getEditorHTML(this._lexical)
    }

    getText(): string {
        return getEditorText(this._lexical)
    }

    setContent(content: SerializedContent | string, emitUpdate = true): void {
        setEditorContent(this._lexical, content)
        if (emitUpdate) {
            this._emitter.emit('update', {
                editor: this,
                editorState: this._lexical.getEditorState(),
            })
        }
    }

    clearContent(emitUpdate = true): void {
        executeBuiltinCommand(this._lexical, 'clearContent', [])
        if (emitUpdate) {
            this._emitter.emit('update', {
                editor: this,
                editorState: this._lexical.getEditorState(),
            })
        }
    }

    isEmpty(): boolean {
        return isEditorEmpty(this._lexical)
    }

    // ─────────────────────────────────────────
    // State
    // ─────────────────────────────────────────

    focus(position: 'start' | 'end' | 'all' = 'end'): void {
        executeBuiltinCommand(this._lexical, 'focus', [position])
    }

    blur(): void {
        executeBuiltinCommand(this._lexical, 'blur', [])
    }

    isFocused(): boolean {
        if (typeof document === 'undefined') return false
        return this._lexical.getRootElement() === document.activeElement
    }

    isEditable(): boolean {
        return this._lexical.isEditable()
    }

    setEditable(editable: boolean): void {
        // registerEditableListener fires editableChange automatically — no manual emit needed
        this._lexical.setEditable(editable)
    }

    // ─────────────────────────────────────────
    // Selection
    // ─────────────────────────────────────────

    isActive(name: string, _attrs?: Record<string, unknown>): boolean {
        // Check text marks first (bold, italic, underline, strikethrough, code, etc.)
        if (isMarkActive(this._lexical, name)) return true
        // Check block types — handles headings by level (h1/h2/h3),
        // lists (bullet/number/check), quote, code block, paragraph
        return isBlockActive(this._lexical, name as any)
    }

    getAttributes(name: string): Record<string, unknown> {
        let attrs: Record<string, unknown> = {}
        this._lexical.getEditorState().read(() => {
            const selection = $getSelection()
            if (!$isRangeSelection(selection)) return
            const nodes = selection.getNodes()
            for (const node of nodes) {
                if (node.getType() === name) {
                    // Extract exportJSON for attribute inspection
                    const json = (node as any).exportJSON?.() ?? {}
                    const { type, version, ...rest } = json
                    attrs = rest
                    break
                }
                const parent = node.getParent()
                if (parent?.getType() === name) {
                    const json = (parent as any).exportJSON?.() ?? {}
                    const { type, version, ...rest } = json
                    attrs = rest
                    break
                }
            }
        })
        return attrs
    }

    // ─────────────────────────────────────────
    // Commands
    // ─────────────────────────────────────────

    chain(): ChainBuilder {
        return createChainBuilder(this._lexical, this._registry)
    }

    can(): CanChainBuilder {
        return createCanChainBuilder(this._lexical, this._registry)
    }

    run(command: string, ...args: unknown[]): boolean {
        const lexicalCmd = this._registry.getLexicalCommand(command)
        if (lexicalCmd) return this._lexical.dispatchCommand(lexicalCmd, args[0])
        return executeBuiltinCommand(this._lexical, command, args)
    }

    // ─────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────

    on<TEvent extends TypixEventName>(
        event: TEvent,
        listener: TypixEventListener<TEvent>,
    ): () => void {
        return this._emitter.on(event, listener)
    }

    off<TEvent extends TypixEventName>(
        event: TEvent,
        listener: TypixEventListener<TEvent>,
    ): void {
        this._emitter.off(event, listener)
    }

    once<TEvent extends TypixEventName>(
        event: TEvent,
        listener: TypixEventListener<TEvent>,
    ): () => void {
        return this._emitter.once(event, listener)
    }

    // ─────────────────────────────────────────
    // Extensions
    // ─────────────────────────────────────────

    getShortcuts() {
        return this._registry.getAllShortcuts()
    }

    // ─────────────────────────────────────────
    // Escape hatch
    // ─────────────────────────────────────────

    get lexical(): LexicalEditor {
        return this._lexical
    }

    // ─────────────────────────────────────────
    // Private
    // ─────────────────────────────────────────

    private _registerCoreListeners(): void {
        // Forward Lexical update events → Typix events
        const unregisterUpdate = this._lexical.registerUpdateListener(
            ({ editorState }) => {
                this._emitter.emit('update', { editor: this, editorState })
            },
        )

        // Forward Lexical editable change → Typix events
        const unregisterEditable = this._lexical.registerEditableListener(
            (editable) => {
                this._emitter.emit('editableChange', { editor: this, editable })
            },
        )

        // Focus/blur via root element listener
        this._handleFocus = () => this._emitter.emit('focus', { editor: this })
        this._handleBlur = () => this._emitter.emit('blur', { editor: this })

        const handleFocus = this._handleFocus
        const handleBlur = this._handleBlur

        // We attach focus/blur after mount since we need the root element
        const unregisterRoot = this._lexical.registerRootListener((root, prevRoot) => {
            prevRoot?.removeEventListener('focus', handleFocus)
            prevRoot?.removeEventListener('blur', handleBlur)
            this._currentRoot = root
            root?.addEventListener('focus', handleFocus)
            root?.addEventListener('blur', handleBlur)
        })

        this._disposers.push(unregisterUpdate, unregisterEditable, unregisterRoot)
    }

    private _removeDomListeners(): void {
        if (this._currentRoot) {
            if (this._handleFocus) this._currentRoot.removeEventListener('focus', this._handleFocus)
            if (this._handleBlur) this._currentRoot.removeEventListener('blur', this._handleBlur)
            this._currentRoot = null
        }
    }
}
