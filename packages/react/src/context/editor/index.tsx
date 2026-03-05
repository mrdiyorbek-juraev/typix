"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { TypixEditor, ExtensionRegistry, type TypixExtensionDefinition } from "@typix-editor/core";

/**
 * Context shape for TypixEditor
 */
interface TypixEditorContextValue {
  editor: TypixEditor;
}

const TypixEditorContext = createContext<TypixEditorContextValue | null>(null);

/**
 * Provider component that creates and provides a TypixEditor instance.
 *
 * This must be used inside a LexicalComposer.
 * Typically you won't use this directly - EditorRoot sets it up automatically.
 */
export function TypixEditorProvider({
  children,
  extensions = [],
}: {
  children: ReactNode;
  extensions?: TypixExtensionDefinition[];
}) {
  const [lexicalEditor] = useLexicalComposerContext();

  // Create TypixEditor instance with a populated registry so chain() commands work
  const editor = useMemo(() => {
    const registry = new ExtensionRegistry();
    for (const ext of extensions) {
      registry.register(ext);
    }
    return new TypixEditor(lexicalEditor, registry, "typix-react");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lexicalEditor]); // extensions should be stable (defined outside render or memoized)

  const value = useMemo(() => ({ editor }), [editor]);

  return (
    <TypixEditorContext.Provider value={value}>
      {children}
    </TypixEditorContext.Provider>
  );
}

/**
 * Hook to access the TypixEditor instance.
 *
 * Provides a clean, fluent API for editor operations.
 *
 * @throws Error if used outside of EditorRoot
 *
 * @example
 * ```tsx
 * function MyToolbar() {
 *   const editor = useTypixEditor();
 *
 *   return (
 *     <div>
 *       <button onClick={() => editor.toggleBold()}>Bold</button>
 *       <button onClick={() => editor.toggleItalic()}>Italic</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTypixEditor(): TypixEditor {
  const context = useContext(TypixEditorContext);

  if (!context) {
    throw new Error(
      "useTypixEditor must be used within EditorRoot. " +
        "Make sure your component is wrapped in <EditorRoot>."
    );
  }

  return context.editor;
}

export { TypixEditorContext, type TypixEditorContextValue };
