import type { JSX } from "react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { LexicalEditor } from "lexical";
import { useTypixEditorState } from "@typix-editor/react";
import { getExtensionOutput } from "@typix-editor/core";
import { FloatingLinkExtension, type FloatingLinkOutput } from "@typix-editor/extension-floating-link";
import { FloatingLinkEditorPortal } from "./portal";
import type { FloatingLinkUIProps } from "../types";

/**
 * FloatingLinkUI
 *
 * Renders a floating link editor that appears when a link is selected.
 * Uses the FloatingLinkExtension signals to track link state.
 *
 * @example
 * ```tsx
 * <EditorRoot config={config}>
 *   <EditorContent />
 *   <FloatingLinkUI />
 * </EditorRoot>
 * ```
 */
export function FloatingLinkUI({
  anchorElem,
  children,
  verticalOffset = 40,
}: FloatingLinkUIProps = {}): JSX.Element | null {
  const typixEditor = useTypixEditorState();
  const editor = typixEditor.lexical;
  const output = getExtensionOutput<FloatingLinkOutput>(editor, FloatingLinkExtension);

  const [isLink, setIsLink] = useState(() => output?.isLink.value ?? false);
  const [activeEditor, setActiveEditor] = useState<LexicalEditor>(
    () => output?.activeEditor.value ?? editor
  );

  // Defer document.body resolution to after hydration to avoid SSR mismatch.
  const [defaultAnchor, setDefaultAnchor] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!anchorElem) {
      setDefaultAnchor(document.body);
    }
  }, [anchorElem]);

  useEffect(() => {
    if (!output) return;
    const unsubIsLink = output.isLink.subscribe(setIsLink);
    const unsubActiveEditor = output.activeEditor.subscribe(setActiveEditor);
    return () => {
      unsubIsLink();
      unsubActiveEditor();
    };
  }, [output]);

  const handleSetIsLink = useCallback(
    (val: boolean) => {
      if (output) {
        output.isLink.value = val;
      }
    },
    [output]
  );

  const resolvedAnchorElem = anchorElem ?? defaultAnchor;

  if (!resolvedAnchorElem) {
    return null;
  }

  return createPortal(
    <FloatingLinkEditorPortal
      editor={activeEditor}
      anchorElem={resolvedAnchorElem}
      isLink={isLink}
      setIsLink={handleSetIsLink}
      verticalOffset={verticalOffset}
    >
      {children}
    </FloatingLinkEditorPortal>,
    resolvedAnchorElem
  );
}

FloatingLinkUI.displayName = "Typix.FloatingLinkUI";
