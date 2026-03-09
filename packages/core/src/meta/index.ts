import type { AnyLexicalExtension, LexicalCommand, LexicalEditor } from 'lexical'

// ── Types ──

/** Maps friendly command names (e.g. "toggleBold") to Lexical commands. */
export interface TypixCommandMap {
  [commandName: string]: LexicalCommand<any>
}

/** Keyboard shortcut definition for a Typix command. */
export interface TypixShortcut {
  key: string
  modifiers: Array<'mod' | 'shift' | 'alt'>
  command: string // references a key in TypixCommandMap
  args?: unknown
}

/** Metadata attached to a native Lexical extension for Typix DX features. */
export interface TypixMeta {
  commands?: TypixCommandMap
  shortcuts?: TypixShortcut[]
}

// ── WeakMap storage ──

const metaStore = new WeakMap<AnyLexicalExtension, TypixMeta>()

/** Attach Typix metadata to a native Lexical extension. */
export function registerTypixMeta(
  extension: AnyLexicalExtension,
  meta: TypixMeta,
): void {
  metaStore.set(extension, meta)
}

/** Read Typix metadata from a Lexical extension. */
export function getTypixMeta(
  extension: AnyLexicalExtension,
): TypixMeta | undefined {
  return metaStore.get(extension)
}

/**
 * Resolve metadata from an extension OR a configExtension tuple.
 * configExtension() returns [ext, ...configs] — metadata lives on ext.
 */
export function resolveTypixMeta(
  extOrTuple: AnyLexicalExtension | [AnyLexicalExtension, ...unknown[]],
): TypixMeta | undefined {
  const base = Array.isArray(extOrTuple) ? extOrTuple[0] : extOrTuple
  return getTypixMeta(base)
}

/**
 * Merge metadata from multiple extensions into one TypixMeta.
 * Used by StarterKit-style composition extensions.
 * Warns on duplicate command names.
 */
export function mergeTypixMeta(
  extensions: Array<
    AnyLexicalExtension | [AnyLexicalExtension, ...unknown[]]
  >,
): TypixMeta {
  const commands: TypixCommandMap = {}
  const shortcuts: TypixShortcut[] = []

  for (const ext of extensions) {
    const meta = resolveTypixMeta(ext)
    if (!meta) continue

    if (meta.commands) {
      for (const [name, cmd] of Object.entries(meta.commands)) {
        if (name in commands) {
          console.warn(
            `[Typix] Duplicate command name "${name}" during metadata merge.`,
          )
          continue
        }
        commands[name] = cmd
      }
    }

    if (meta.shortcuts) {
      shortcuts.push(...meta.shortcuts)
    }
  }

  return { commands, shortcuts }
}

// ── Per-editor output store ──

const outputStore = new WeakMap<LexicalEditor, WeakMap<AnyLexicalExtension, unknown>>()

/**
 * Register per-editor output for a static extension.
 * Call this inside `build(editor)` to make the output retrievable by consumers.
 */
export function registerExtensionOutput<T>(
  editor: LexicalEditor,
  ext: AnyLexicalExtension,
  output: T,
): void {
  if (!outputStore.has(editor)) outputStore.set(editor, new WeakMap())
  outputStore.get(editor)!.set(ext, output)
}

/**
 * Retrieve the per-editor output for a static extension.
 * Returns undefined if the extension was not registered for this editor.
 */
export function getExtensionOutput<T>(
  editor: LexicalEditor,
  ext: AnyLexicalExtension,
): T | undefined {
  return outputStore.get(editor)?.get(ext) as T | undefined
}

/**
 * Convenience: define a Lexical extension and attach Typix metadata in one call.
 * The result IS a native Lexical extension — no wrapping.
 */
export function typixExtension<Ext extends AnyLexicalExtension>(
  extension: Ext,
  meta?: TypixMeta,
): Ext {
  if (meta) registerTypixMeta(extension, meta)
  return extension
}
