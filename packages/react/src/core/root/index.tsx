"use client";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type {
  AnyLexicalExtensionArgument,
  EditorState,
  SerializedEditorState,
} from "lexical";
import { TypixEditorProvider } from "../../context/editor";
import { History, SharedHistoryContext } from "../../context/history";
import { RootContext } from "../../context/root";

interface EditorRootProps {
  /**
   * Child components rendered inside the editor context.
   */
  children: React.ReactNode;

  /**
   * Root extension built with `defineExtension`. When provided, the editor is
   * created via `LexicalExtensionComposer` and the legacy `config` prop is
   * ignored. Include History, List, AutoFocus etc. in your extension's
   * `dependencies` array.
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
  extension,
  onChange,
  onContentChange,
}: EditorRootProps) => {
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

  if (!extension) return null;

  return (
    <LexicalExtensionComposer extension={extension} contentEditable={null}>
      <TypixEditorProvider>
        <RootContext>
          <SharedHistoryContext>
            {changePlugin}
            {children}
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
