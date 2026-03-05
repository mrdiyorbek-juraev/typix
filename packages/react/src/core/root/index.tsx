"use client";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type {
  AnyLexicalExtensionArgument,
  EditorState,
  EditorThemeClasses,
  SerializedEditorState,
} from "lexical";
import { defineExtension } from "lexical";
import { useMemo } from "react";
import type { TypixExtensionDefinition } from "@typix-editor/core";
import { TypixEditorProvider } from "../../context/editor";
import { History, SharedHistoryContext } from "../../context/history";
import { RootContext } from "../../context/root";
import { ShortcutsPlugin } from "../shortcuts";

interface EditorRootProps {
  /**
   * Child components rendered inside the editor context.
   */
  children: React.ReactNode;

  /**
   * Typix extensions (e.g. StarterKit()). The editor will register their
   * commands and build the underlying Lexical extension automatically.
   * This is the recommended way to configure the editor.
   *
   * @example
   * ```tsx
   * <EditorRoot extensions={StarterKit()} namespace="my-editor" theme={defaultTheme}>
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extensions?: TypixExtensionDefinition<any>[];

  /**
   * Editor namespace. Used when building the Lexical extension from
   * `typixExtensions`. Ignored when `extension` is provided directly.
   */
  namespace?: string;

  /**
   * Lexical theme classes. Used when building from `typixExtensions`.
   * Ignored when `extension` is provided directly.
   */
  theme?: EditorThemeClasses;

  /**
   * Pre-built Lexical extension (escape hatch / advanced usage).
   * Use `typixExtensions` instead for the standard flow.
   */
  extension?: AnyLexicalExtensionArgument;

  /**
   * Called when editor content changes (raw EditorState).
   */
  onChange?: (editorState: EditorState) => void;

  /**
   * Called when editor content changes (serialized JSON).
   */
  onContentChange?: (content: SerializedEditorState) => void;
}

const EditorRoot = ({
  children,
  extensions,
  namespace = "typix",
  theme,
  extension,
  onChange,
  onContentChange,
}: EditorRootProps) => {
  // Build the Lexical extension from typixExtensions when no explicit extension given
  const editor = useMemo(() => {
    if (extension) return extension;
    if (!extensions?.length) return null;
    return defineExtension({
      name: "typix/root",
      namespace,
      theme,
      dependencies: extensions.map((e) => e.typix),
    });
  // typixExtensions should be stable (module-level or memoized by caller)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extension, namespace, theme]);

  const changePlugin =
    onChange || onContentChange ? (
      <OnChangePlugin
        ignoreSelectionChange={true}
        onChange={(editorState) => {
          onChange?.(editorState);
          onContentChange?.(editorState.toJSON());
        }}
      />
    ) : null;

  if (!editor) return null;

  return (
    <LexicalExtensionComposer extension={editor} contentEditable={null}>
      <TypixEditorProvider extensions={extensions}>
        <RootContext>
          <SharedHistoryContext>
            {changePlugin}
            {children}
            <ShortcutsPlugin />
            <History />
            <ListPlugin />
            <AutoFocusPlugin />
          </SharedHistoryContext>
        </RootContext>
      </TypixEditorProvider>
    </LexicalExtensionComposer>
  );
};

EditorRoot.displayName = "Typix.EditorRoot";

export { EditorRoot, type EditorRootProps };
