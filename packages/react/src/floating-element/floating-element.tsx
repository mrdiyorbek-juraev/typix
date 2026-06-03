"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createPortal } from "react-dom";
import { useRootContext } from "../root-context";
import { useFloatingElement } from "./use-floating-element";
import type { FloatingElementProps } from "./types";
import { cn } from "@typix-editor/utils";

function FloatingElement({
  children,
  className,
  style,
  zIndex = 50,
  shouldShow,
  referenceElement,
  getBoundingClientRect,
  closeOnEscape = true,
  verticalGap = 10,
  horizontalOffset = 5,
  onOpenChange,
}: FloatingElementProps) {
  const [editor] = useLexicalComposerContext();
  const { floatingAnchorElem } = useRootContext();

  const { elemRef } = useFloatingElement({
    editor,
    anchorElem: floatingAnchorElem,
    shouldShow,
    referenceElement,
    getBoundingClientRect,
    closeOnEscape,
    verticalGap,
    horizontalOffset,
    onOpenChange,
  });

  if (!floatingAnchorElem) return null;

  return createPortal(
    <div
      ref={elemRef}
      className={cn("typix-floating-element", className)}
      style={{
        // FIX #5: consumer style spread first — functional positioning styles
        // must not be overridable or the opacity/transform mechanism breaks.
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
        opacity: 0,
        willChange: "transform",
        zIndex,
      }}
    >
      {children}
    </div>,
    floatingAnchorElem
  );
}

FloatingElement.displayName = "Typix.FloatingElement";

export { FloatingElement };
