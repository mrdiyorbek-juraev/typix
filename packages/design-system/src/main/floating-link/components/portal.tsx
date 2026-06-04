import type { JSX, ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { useFloatingLinkEditor } from "../hooks/use-floating-link-editor";
import type { FloatingLinkRenderProps } from "../types";
import { DefaultFloatingLinkUI } from "./default-ui";
import type { TypixEditor } from "@typix-editor/core";

export function FloatingLinkEditorPortal({
  editor,
  anchorElem,
  isLink,
  setIsLink,
  children,
  verticalOffset,
}: {
  editor: TypixEditor["_lexical"];
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
      className={cn(
        "typix-floating-link",
        "absolute top-0 left-0 z-20 flex w-max max-w-[400px] opacity-0",
        "rounded-lg border border-border bg-popover text-popover-foreground shadow-md",
        "text-[13px] antialiased",
        "transition-opacity duration-150 ease-out",
        "empty:border-0 empty:bg-transparent empty:shadow-none empty:pointer-events-none"
      )}
      onMouseDown={(e) => {
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
