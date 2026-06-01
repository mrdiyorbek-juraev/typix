import { $getSelection, $isRangeSelection, type LexicalEditor } from 'lexical'
import type {
    TypixEditorInstance,
    TypixEventName,
    TypixEventListener,
    SerializedContent,
    ChainBuilder,
    CanChainBuilder,
} from '../../types'
import { ExtensionRegistry, TYPIX_META } from '../../extension'
import type {
    ExtensionCommands,
    ExtensionStorage,
    TypixExtension,
} from '../../extension'
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

    // Per-editor typed storage, keyed by extension identity.
    private _storage = new WeakMap<object, unknown>()

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

        this._initV5Storage()
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
        // Fire extension onDestroy hooks before tearing down
        this._runV5LifecycleHook('onDestroy')
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
        return state.toJSON() as unknown as SerializedContent
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
        if (isMarkActive(this._lexical, name)) return true
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
        // Typed factory takes precedence over legacy Lexical command map
        const factory = this._registry.getCommandFactory(command)
        if (factory) {
            try {
                const fn = factory(...args)
                return fn(this._lexical) !== false
            } catch (err: unknown) {
                console.error(`[Typix] Error in v5 command "${command}":`, err)
                return false
            }
        }
        // Legacy Lexical command map
        const lexicalCmd = this._registry.getLexicalCommand(command)
        if (lexicalCmd) return this._lexical.dispatchCommand(lexicalCmd, args[0])
        // Built-in fallback
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

    /**
     * Typed access to per-editor storage declared by an extension via
     * `withTypixMeta(defineExtension({...}), { storage: () => ... })`.
     */
    storage<E extends TypixExtension>(extension: E): ExtensionStorage<E> {
        return this._storage.get(extension as unknown as object) as ExtensionStorage<E>
    }

    /**
     * Typed access to an extension's command record. Useful when you
     * want to invoke a single command without going through chain().
     */
    commands<E extends TypixExtension>(extension: E): ExtensionCommands<E> {
        const meta = (extension as unknown as Record<symbol, unknown>)[
            TYPIX_META
        ] as { commands?: () => ExtensionCommands<E> } | undefined
        return meta?.commands?.() ?? ({} as ExtensionCommands<E>)
    }

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
    // Internal: emit `create` after construction (called by createTypix).
    // Separate from the constructor so listeners attached pre-emit fire.
    // ─────────────────────────────────────────

    /** @internal */
    _emitCreate(): void {
        this._runV5LifecycleHook('onCreate')
        this._emitter.emit('create', { editor: this })
    }

    // ─────────────────────────────────────────
    // Private
    // ─────────────────────────────────────────

    private _initV5Storage(): void {
        for (const { ext, meta } of this._registry.getLifecycleMetas()) {
            if (meta.storage) {
                try {
                    this._storage.set(ext as unknown as object, meta.storage())
                } catch (err) {
                    console.error(
                        `[Typix] Error initializing storage for "${meta.name}":`,
                        err,
                    )
                }
            }
        }
    }

    private _runV5LifecycleHook(hook: 'onCreate' | 'onDestroy'): void {
        for (const { ext, meta } of this._registry.getLifecycleMetas()) {
            const fn = meta[hook]
            if (!fn) continue
            try {
                fn({
                    editor: this._lexical,
                    storage: this._storage.get(ext as unknown as object),
                })
            } catch (err) {
                console.error(
                    `[Typix] Error in ${hook} for "${meta.name}":`,
                    err,
                )
            }
        }
    }

    private _registerCoreListeners(): void {
        // Single update-listener fan-out emits update / contentUpdate /
        // selectionChange / transaction. Avoids four separate Lexical
        // subscriptions for the same callback.
        const unregisterUpdate = this._lexical.registerUpdateListener(
            (payload) => {
                const {
                    editorState,
                    prevEditorState,
                    dirtyElements,
                    dirtyLeaves,
                    tags,
                } = payload

                // Transaction — lowest level, fires once per update
                this._emitter.emit('transaction', {
                    editor: this,
                    editorState,
                    prevEditorState,
                    dirtyElements,
                    dirtyLeaves,
                    tags,
                })

                // Update — fires for every update (selection-only included)
                this._emitter.emit('update', { editor: this, editorState })

                const hasNodeChanges =
                    dirtyElements.size > 0 || dirtyLeaves.size > 0

                if (hasNodeChanges) {
                    this._emitter.emit('contentUpdate', {
                        editor: this,
                        editorState,
                    })
                }

                // Selection moved without content changing
                const selectionChanged =
                    !hasNodeChanges &&
                    prevEditorState._selection !== editorState._selection

                if (selectionChanged) {
                    this._emitter.emit('selectionChange', {
                        editor: this,
                        editorState,
                    })
                }
            },
        )

        // Forward Lexical editable change → Typix event
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
