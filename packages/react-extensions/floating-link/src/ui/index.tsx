import type { JSX } from "react";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createPortal } from "react-dom";
import type { LexicalEditor } from "lexical";
import { FloatingLinkEditorPortal } from "../components/portal";
import { getFloatingLinkOutput } from "@typix-editor/extension-floating-link";
import type { FloatingLinkUIProps } from "./types";

export function FloatingLinkUI({
  anchorElem,
  children,
  verticalOffset = 40,
}: FloatingLinkUIProps = {}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const output = getFloatingLinkOutput(editor);

  const [isLink, setIsLink] = useState(() => output?.isLink.value ?? false);
  const [activeEditor, setActiveEditor] = useState<LexicalEditor>(
    () => output?.activeEditor.value ?? editor
  );

  // Defer document.body resolution to after hydration to avoid SSR mismatch.
  // On the server (and client's first render), this is null; useEffect sets it
  // after mount so both server and client agree on the initial render output.
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
