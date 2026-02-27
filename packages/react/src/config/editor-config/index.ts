// ============================================================================s
// Utility for creating Lexical editor configuration
// ============================================================================
import type {
  InitialConfigType,
  InitialEditorStateType,
} from "@lexical/react/LexicalComposer";

import type {
  EditorThemeClasses,
  HTMLConfig,
  Klass,
  LexicalEditor,
  LexicalNode,
  LexicalNodeReplacement,
  SerializedEditorState,
} from "lexical";

/**
 * Options for creating an editor configuration
 */
interface CreateEditorConfigOptions {
  /**
   * Unique namespace for the editor instance.
   * Important when using multiple editors on the same page.
   * @default "typix-editor"
   */
  namespace?: string;

  /**
   * Custom theme classes for styling editor elements.
   * @see https://lexical.dev/docs/concepts/theming
   */
  theme?: EditorThemeClasses;

  /**
   * Custom Lexical nodes to register with the editor.
   * Typically provided by extensions.
   * @default []
   */
  extensionNodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>;

  /**
   * Whether the editor is editable.
   * @default true
   */
  editable?: boolean;

  /**
   * Custom error handler for Lexical errors.
   * If not provided, errors are logged to console.
   *
   * @param error - The error that occurred
   * @param editor - The Lexical editor instance
   */
  onError?: (error: Error, editor: LexicalEditor) => void;

  /**
   * Initial editor content as a serialized state object.
   * Will be automatically converted to JSON string.
   *
   * @example
   * ```tsx
   * initialState: { root: { children: [], type: "root" } }
   * ```
   */
  initialState?: SerializedEditorState;

  /**
   * Advanced: Direct editor state override.
   * Use `initialContent` or `initialState` instead for most cases.
   */
  editorState?: InitialEditorStateType;
  html?: HTMLConfig;
}

/**
 * @deprecated Build a root extension with `defineExtension` and pass it to
 * `LexicalExtensionComposer` or `EditorRoot`'s `extension` prop instead.
 */
function createEditorConfig(
  options: CreateEditorConfigOptions = {}
): InitialConfigType {
  const {
    namespace = "typix-editor",
    theme,
    extensionNodes = [],
    editable = true,
    onError,
    editorState,
    initialState,
    html,
  } = options;

  if (editorState && initialState) {
    console.warn(
      "[@typix-editor/react] Both `editorState` and `initialState` were provided to createEditorConfig. " +
        "`initialState` takes priority. Remove one to silence this warning."
    );
  }

  const resolvedEditorState = initialState
    ? JSON.stringify(initialState)
    : editorState;

  return {
    namespace,
    theme,
    nodes: [...extensionNodes],
    editable,
    ...(resolvedEditorState ? { editorState: resolvedEditorState } : {}),
    onError: onError || ((error) => console.error(error)),
    html,
  };
}

export { createEditorConfig, type CreateEditorConfigOptions };
