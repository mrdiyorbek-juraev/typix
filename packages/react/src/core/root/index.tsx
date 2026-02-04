"use client";
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { defaultTheme } from "../../theme";
import { type EditorState, type SerializedEditorState } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { History, SharedHistoryContext } from "../../context/history";
import { RootContext } from "../../context/root";
import { TypixEditorProvider } from "../../context/editor";
import { defaultExtensionNodes } from "../../shared";
import { createEditorConfig } from "../../config";

/**
 * Props for the TypixEditorRoot component.
 *
 * @example
 * ```tsx
 * <TypixEditorRoot
 *   namespace="my-editor"
 *   initialContent='{"root":{"children":[...],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
 *   nodes={[BoldNode, ItalicNode]}
 * >
 *   <RichTextPlugin />
 * </TypixEditorRoot>
 * ```
 */

interface EditorRootProps {
  /**
   * Child components (typically Lexical plugins like RichTextPlugin, HistoryPlugin, etc.)
   */
  children: React.ReactNode;

  config?: InitialConfigType;

  /**
   * Initial content to load into the editor
   */
  content?: SerializedEditorState | null;

  /**
   * Called when editor content changes (raw EditorState)
   * Use for advanced state manipulation
   */
  onChange?: (editorState: EditorState) => void;

  /**
   * Called when editor content changes (serialized JSON)
   * Use for saving to database or localStorage
   *
   * @example
   * ```tsx
   * onContentChange={(json) => {
   *   localStorage.setItem('draft', JSON.stringify(json));
   * }}
   * ```
   */
  onContentChange?: (content: SerializedEditorState) => void;
}

const EditorRoot = ({
  children,
  config,
  content = null,
  onChange,
  onContentChange,
}: EditorRootProps) => {
  const defaultConfig =
    config ||
    createEditorConfig({
      namespace: "typix-editor",
      extension_nodes: defaultExtensionNodes,
      editable: true,
      editorState: null,
      initialState: content!,
      theme: defaultTheme,
    });

  return (
    <LexicalComposer initialConfig={defaultConfig}>
      <TypixEditorProvider>
        <RootContext>
          <SharedHistoryContext>
            {(onChange || onContentChange) && (
              <OnChangePlugin
                ignoreSelectionChange={true}
                onChange={(editorState) => {
                  onChange?.(editorState);
                  onContentChange?.(editorState.toJSON());
                }}
              />
            )}
            {children}
            <History />
            <ListPlugin />
          </SharedHistoryContext>
        </RootContext>
      </TypixEditorProvider>
    </LexicalComposer>
  );
};

EditorRoot.displayName = "Typix.EditorRoot";

export { EditorRoot, type EditorRootProps };
