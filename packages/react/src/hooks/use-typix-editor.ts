"use client";

import { useEffect, useRef, useState } from "react";
import type {
  EditorThemeClasses,
  AnyLexicalExtension,
  AnyLexicalExtensionArgument,
} from "lexical";
import { configExtension, defineExtension } from "lexical";
import { LexicalBuilder } from "@lexical/extension";
import { ReactProviderExtension } from "@lexical/react/ReactProviderExtension";
import { ReactExtension } from "@lexical/react/ReactExtension";
import {
  ExtensionRegistry,
  TypixEditor,
  type SerializedContent,
  type TypixEventMap,
} from "@typix-editor/core";

// ─────────────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────────────

export interface UseTypixEditorOptions {
  /**
   * Extensions to include. Each item is either a bare Lexical extension
   * or a `configExtension(Ext, { ...config })` tuple — both are accepted.
   *
   * **Define this array at module scope or memoize it** — passing a new
   * array literal on every render will recreate the editor and lose state.
   */
  extensions: AnyLexicalExtensionArgument[];

  /** Initial content (serialized JSON or HTML string). */
  content?: SerializedContent | string;

  /** Namespace passed to Lexical. */
  namespace?: string;

  /** Lexical theme class map. */
  theme?: EditorThemeClasses;

  /** Whether the editor starts editable. Default: true. */
  editable?: boolean;

  /**
   * If `false`, the editor is created on mount instead of synchronously
   * during render — required for SSR (Next.js App Router) to avoid
   * hydration mismatches. The hook returns `null` on the first render.
   * Default: `true`.
   */
  immediatelyRender?: boolean;

  /** Unhandled-error sink for Lexical. Defaults to rethrow. */
  onError?: (error: Error) => void;

  // ── Lifecycle hooks (all optional) ─────────────────
  onBeforeCreate?: (payload: { options: UseTypixEditorOptions }) => void;
  onCreate?: (payload: TypixEventMap["create"]) => void;
  onUpdate?: (payload: TypixEventMap["update"]) => void;
  onContentUpdate?: (payload: TypixEventMap["contentUpdate"]) => void;
  onSelectionUpdate?: (payload: TypixEventMap["selectionChange"]) => void;
  onTransaction?: (payload: TypixEventMap["transaction"]) => void;
  onFocus?: (payload: TypixEventMap["focus"]) => void;
  onBlur?: (payload: TypixEventMap["blur"]) => void;
  onEditableChange?: (payload: TypixEventMap["editableChange"]) => void;
  onDestroy?: (payload: TypixEventMap["destroy"]) => void;
}

// ─────────────────────────────────────────────────────
// The hook
// ─────────────────────────────────────────────────────

/**
 * Create a Typix editor instance bound to this component's lifetime.
 *
 * The returned `TypixEditor` is a real Lexical editor wrapped with the
 * Typix chain/can/storage API. Pass it to `<EditorContent editor={editor} />`
 * to render the editable surface, and to `<TypixEditorContext.Provider>`
 * (or use `<TypixEditorProvider>`) to share it with descendant components.
 *
 * To autofocus on mount, pass `autoFocus="end"` to `<EditorContent>` — not
 * here. Autofocus is a rendering concern owned by the editable surface.
 */
export function useTypixEditor(
  options: UseTypixEditorOptions
): TypixEditor | null {
  // Hold the latest options in a ref so lifecycle effects can read them
  // without recreating the editor on every options change.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const immediate = options.immediatelyRender !== false;

  const [editor, setEditor] = useState<TypixEditor | null>(() =>
    immediate ? createReactEditor(options) : null
  );

  // Deferred creation for SSR
  useEffect(() => {
    if (editor !== null) return;
    if (typeof window === "undefined") return;
    setEditor(createReactEditor(optionsRef.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wire post-creation lifecycle hooks via the event emitter. `create`
  // and `beforeCreate` are wired inline at construction time (see
  // createReactEditor) because they fire synchronously during build.
  useEffect(() => {
    if (!editor) return;
    const o = optionsRef.current;
    const offs: Array<() => void> = [];
    if (o.onUpdate) offs.push(editor.on("update", o.onUpdate));
    if (o.onContentUpdate)
      offs.push(editor.on("contentUpdate", o.onContentUpdate));
    if (o.onSelectionUpdate)
      offs.push(editor.on("selectionChange", o.onSelectionUpdate));
    if (o.onTransaction) offs.push(editor.on("transaction", o.onTransaction));
    if (o.onFocus) offs.push(editor.on("focus", o.onFocus));
    if (o.onBlur) offs.push(editor.on("blur", o.onBlur));
    if (o.onEditableChange)
      offs.push(editor.on("editableChange", o.onEditableChange));
    if (o.onDestroy) offs.push(editor.on("destroy", o.onDestroy));
    return () => offs.forEach((off) => off());
  }, [editor]);

  // Destroy on unmount. Strict mode double-invokes effects in dev; the
  // queueMicrotask gate matches Lexical's own LexicalExtensionComposer
  // pattern — only destroy if the editor actually committed.
  useEffect(() => {
    if (!editor) return;
    let didMount = false;
    queueMicrotask(() => {
      didMount = true;
    });
    return () => {
      if (didMount) {
        editor.destroy();
      }
    };
  }, [editor]);

  return editor;
}

// ─────────────────────────────────────────────────────
// Internal: build a React-aware Typix editor
// ─────────────────────────────────────────────────────

/**
 * Constructs a TypixEditor whose underlying Lexical editor includes the
 * @lexical/react ReactProviderExtension + ReactExtension. That allows
 * EditorContent to render decorator portals via the Component output of
 * ReactExtension. The result is otherwise identical to what createTypix
 * from core builds — including the dependency-graph walk so aggregator
 * extensions like StarterKit register their sub-extension commands.
 */
function createReactEditor(options: UseTypixEditorOptions): TypixEditor {
  options.onBeforeCreate?.({ options });

  // Guard against bare factory functions in the extensions list. Several
  // extensions (StarterKit, MarkdownShortcutsExtension, TabFocusExtension,
  // …) are *factories* — `extensions: [MarkdownShortcutsExtension]` looks
  // sensible to the type checker (functions are valid input here) but the
  // function's `.name` collides with another bare factory after minifier
  // mangling, surfacing as the cryptic Lexical #298 ("multiple extensions
  // registered with name ") in production. Fail loudly instead.
  for (let i = 0; i < options.extensions.length; i++) {
    const candidate = options.extensions[i];
    const unwrapped = Array.isArray(candidate) ? candidate[0] : candidate;
    if (typeof unwrapped === "function") {
      const fnName = (unwrapped as { name?: string }).name || "<anonymous>";
      throw new Error(
        `[typix] extensions[${i}] is a factory function (\`${fnName}\`). ` +
          `Did you mean \`${fnName}()\`? Some Typix extensions are factories ` +
          `(StarterKit, MarkdownShortcutsExtension, TabFocusExtension, …) and ` +
          `must be called. Passing the bare function trips Lexical #298 once ` +
          `the bundle is minified.`
      );
    }
  }

  // Walk the dependency graph the same way createTypix does so aggregator
  // extensions (StarterKit) surface their sub-extension commands, shortcuts,
  // storage, and lifecycle hooks in the registry. Without this walk,
  // `editor.chain().toggleBold()` would silently fall through because
  // `toggleBold` lives on a sub-extension, not on StarterKit itself.
  const registry = new ExtensionRegistry();
  const seen = new WeakSet<AnyLexicalExtension>();
  const registerRecursively = (input: AnyLexicalExtensionArgument): void => {
    const base: AnyLexicalExtension = Array.isArray(input)
      ? (input[0] as AnyLexicalExtension)
      : input;
    if (seen.has(base)) return;
    seen.add(base);
    registry.register(input);
    const deps = (base as { dependencies?: AnyLexicalExtensionArgument[] })
      .dependencies;
    if (deps) {
      for (const dep of deps) registerRecursively(dep);
    }
  };
  for (const ext of options.extensions) registerRecursively(ext);

  const namespace = options.namespace ?? "typix";
  const editable = options.editable ?? true;
  const theme = options.theme ?? {};
  const onError =
    options.onError ??
    ((err: Error) => {
      throw err;
    });

  // The user's extension graph wrapped in a stable root.
  const rootExtension = defineExtension({
    name: `@typix/root/${namespace}`,
    namespace,
    editable,
    theme,
    onError,
    dependencies: options.extensions,
  });

  // Build the editor through @lexical/extension's builder with React
  // wiring added. configExtension(ReactExtension, { contentEditable: null })
  // tells ReactExtension NOT to render its own <ContentEditable> — the
  // RichTextPlugin inside EditorContent renders one with our class names.
  const builder = LexicalBuilder.fromExtensions([
    ReactProviderExtension,
    configExtension(ReactExtension, { contentEditable: null }),
    rootExtension,
  ]);
  const lexicalEditor = builder.buildEditor();

  const typixEditor = new TypixEditor(lexicalEditor, registry, namespace, () =>
    lexicalEditor.dispose()
  );

  // Attach the inline onCreate handler BEFORE emitting create so it fires.
  if (options.onCreate) typixEditor.on("create", options.onCreate);
  // Emit create (also fires extension onCreate hooks)
  typixEditor._emitCreate();

  if (options.content) {
    typixEditor.setContent(options.content, false);
  }

  return typixEditor;
}
