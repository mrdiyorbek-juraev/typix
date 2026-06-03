"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import type { TypixEditor } from "@typix-editor/core";
import { TypixEditorContext } from "./editor-context";
import {
  useTypixEditor,
  type UseTypixEditorOptions,
} from "./hooks/use-typix-editor";

// ─────────────────────────────────────────────────────
// Slot shape — accepts either a static ReactNode or a
// render-prop that receives the editor instance.
// ─────────────────────────────────────────────────────

type Slot = ReactNode | ((editor: TypixEditor) => ReactNode);

function renderSlot(slot: Slot | undefined, editor: TypixEditor): ReactNode {
  if (slot === undefined) return null;
  return typeof slot === "function" ? slot(editor) : slot;
}

// ─────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────

export interface TypixEditorProviderProps extends UseTypixEditorOptions {
  /** Children rendered inside the editor context. Can also be a render-prop. */
  children?: ReactNode | ((editor: TypixEditor) => ReactNode);

  /** Rendered above `children`. Useful for toolbars. */
  slotBefore?: Slot;

  /** Rendered below `children`. Useful for footers / status bars. */
  slotAfter?: Slot;
}

// ─────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────

/**
 * Convenience wrapper that creates a TypixEditor via `useTypixEditor`
 * and provides it through `TypixEditorContext` to descendants.
 *
 * For most apps this is the simplest entry point. If you need the
 * editor instance at the parent level, use `useTypixEditor` directly.
 *
 * @example
 * ```tsx
 * <TypixEditorProvider
 *   extensions={[BoldExtension, ItalicExtension]}
 *   content="<p>Hello</p>"
 *   slotBefore={<Toolbar />}
 * >
 *   {(editor) => <EditorContent editor={editor} />}
 * </TypixEditorProvider>
 * ```
 */
export function TypixEditorProvider(props: TypixEditorProviderProps) {
  const { children, slotBefore, slotAfter, ...editorOptions } = props;
  const editor = useTypixEditor(editorOptions);

  const value = useMemo(() => ({ editor }), [editor]);

  if (!editor) return null;

  return (
    <TypixEditorContext.Provider value={value}>
      {renderSlot(slotBefore, editor)}
      {typeof children === "function" ? children(editor) : children}
      {renderSlot(slotAfter, editor)}
    </TypixEditorContext.Provider>
  );
}
