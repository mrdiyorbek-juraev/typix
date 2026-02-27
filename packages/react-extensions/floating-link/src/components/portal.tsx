import type { JSX, ReactNode } from "react";
import type { LexicalEditor } from "lexical";
import { useFloatingLinkEditor } from "../hooks/use-floating-link-editor";
import type { FloatingLinkRenderProps } from "../ui/types";
import { DefaultFloatingLinkUI } from "./default-ui";

export function FloatingLinkEditorPortal({
  editor,
  anchorElem,
  isLink,
  setIsLink,
  children,
  verticalOffset,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isLink: boolean;
  setIsLink: (val: boolean) => void;
  children?: (props: FloatingLinkRenderProps) => ReactNode;
  verticalOffset: number;
}): JSX.Element {
  const { editorRef, renderProps } = useFloatingLinkEditor({
    editor,
    anchorElem,
    isLink,
    setIsLink,
    verticalOffset,
  });

  return (
    <div
      ref={editorRef}
      className="typix-floating-link"
      onMouseDown={(e) => {
        // Prevent clicks inside the floating link from stealing
        // focus away from the editor, which would close the panel.
        if (e.target !== editorRef.current) {
          e.preventDefault();
        }
      }}
    >
      {!isLink ? null : children ? (
        children(renderProps)
      ) : (
        <DefaultFloatingLinkUI {...renderProps} />
      )}
    </div>
  );
}
