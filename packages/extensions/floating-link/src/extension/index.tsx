import type { JSX } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createPortal } from "react-dom";
import { useRootContext } from "@typix-editor/react";
import { useFloatingLinkToolbar } from "../hooks/use-floating-link-toolbar";
import { FloatingLinkEditorPortal } from "../components/portal";
import type { FloatingLinkExtensionProps } from "../types";

export function FloatingLinkExtension({
  children,
  verticalOffset = 40,
}: FloatingLinkExtensionProps = {}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const { floatingAnchorElem } = useRootContext();
  const { activeEditor, isLink, setIsLink } = useFloatingLinkToolbar(editor);

  if (!floatingAnchorElem) {
    return null;
  }

  return createPortal(
    <FloatingLinkEditorPortal
      editor={activeEditor}
      isLink={isLink}
      setIsLink={setIsLink}
      verticalOffset={verticalOffset}
    >
      {children}
    </FloatingLinkEditorPortal>,
    floatingAnchorElem
  );
}
