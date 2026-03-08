import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  getDOMSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDOMRangeRect, setFloatingElemPosition } from "@typix-editor/core";
import type { UseFloatingElementOptions } from "./types";

export function useFloatingElement({
  editor,
  anchorElem,
  shouldShow,
  referenceElement,
  getBoundingClientRect,
  closeOnEscape = true,
  verticalGap = 10,
  horizontalOffset = 5,
  onOpenChange,
}: UseFloatingElementOptions) {
  const elemRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // FIX #1 + #2: assign refs in render body — no effect needed for ref mutations,
  // and keeps getBoundingClientRect / referenceElement out of useCallback deps.
  const isVisibleRef = useRef(false);
  const onOpenChangeRef = useRef(onOpenChange);
  const referenceElementRef = useRef(referenceElement);
  const getBoundingClientRectRef = useRef(getBoundingClientRect);
  onOpenChangeRef.current = onOpenChange;
  referenceElementRef.current = referenceElement;
  getBoundingClientRectRef.current = getBoundingClientRect;

  // FIX #1: referenceElement + getBoundingClientRect removed from deps —
  // accessed via refs so inline functions/fresh elements don't rebuild the chain.
  const updatePosition = useCallback(() => {
    const elem = elemRef.current;
    if (!elem) return;

    let targetRect: DOMRect | null = null;

    if (referenceElementRef.current) {
      targetRect = referenceElementRef.current.getBoundingClientRect();
    } else if (getBoundingClientRectRef.current) {
      targetRect = getBoundingClientRectRef.current(editor);
    } else {
      const nativeSelection = getDOMSelection(editor._window);
      const rootElement = editor.getRootElement();
      if (
        nativeSelection &&
        rootElement &&
        !nativeSelection.isCollapsed &&
        rootElement.contains(nativeSelection.anchorNode)
      ) {
        targetRect = getDOMRangeRect(nativeSelection, rootElement);
      }
    }

    setFloatingElemPosition(
      targetRect,
      elem,
      anchorElem,
      false,
      verticalGap,
      horizontalOffset
    );
  }, [editor, anchorElem, verticalGap, horizontalOffset]);

  const updateVisibilityAndPosition = useCallback(() => {
    editor.getEditorState().read(() => {
      let visible: boolean;

      if (shouldShow !== undefined) {
        visible = shouldShow;
      } else if (!editor.isEditable() || editor.isComposing()) {
        visible = false;
      } else {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          visible = false;
        } else {
          visible = selection.getTextContent().replace(/\n/g, "") !== "";
        }
      }

      if (isVisibleRef.current !== visible) {
        isVisibleRef.current = visible;
        setIsVisible(visible);
        onOpenChangeRef.current?.(visible);
      }

      if (visible) {
        updatePosition();
      }
    });
  }, [editor, shouldShow, updatePosition]);

  // Mouse drag: disable pointer events during selection
  useEffect(() => {
    function mouseMoveListener(e: MouseEvent) {
      if (
        elemRef.current &&
        (e.buttons === 1 || e.buttons === 3) &&
        elemRef.current.style.pointerEvents !== "none"
      ) {
        const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
        if (!elemRef.current.contains(elementUnderMouse)) {
          elemRef.current.style.pointerEvents = "none";
        }
      }
    }

    function mouseUpListener() {
      if (elemRef.current && elemRef.current.style.pointerEvents !== "auto") {
        elemRef.current.style.pointerEvents = "auto";
      }
    }

    document.addEventListener("mousemove", mouseMoveListener);
    document.addEventListener("mouseup", mouseUpListener);

    return () => {
      document.removeEventListener("mousemove", mouseMoveListener);
      document.removeEventListener("mouseup", mouseUpListener);
    };
  }, []);

  // FIX #4: rAF-throttle resize/scroll — forces layout reads are batched to
  // once per animation frame instead of firing at raw event rate (200–300 Hz).
  useEffect(() => {
    const scrollerElem = anchorElem?.parentElement;
    let rafId: number | null = null;

    const update = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        editor.getEditorState().read(() => {
          updatePosition();
        });
      });
    };

    window.addEventListener("resize", update);
    scrollerElem?.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      scrollerElem?.removeEventListener("scroll", update);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [editor, anchorElem, updatePosition]);

  // DOM selection change
  useEffect(() => {
    document.addEventListener("selectionchange", updateVisibilityAndPosition);
    return () => {
      document.removeEventListener(
        "selectionchange",
        updateVisibilityAndPosition
      );
    };
  }, [updateVisibilityAndPosition]);

  // Lexical editor listeners
  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(() => {
          updateVisibilityAndPosition();
        }),
        // FIX #3: command fires before registerUpdateListener — only reposition
        // here; visibility is already handled by the update listener above.
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            updatePosition();
            return false;
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerRootListener(() => {
          if (editor.getRootElement() === null) {
            isVisibleRef.current = false;
            setIsVisible(false);
            onOpenChangeRef.current?.(false);
          }
        })
      ),
    [editor, updateVisibilityAndPosition, updatePosition]
  );

  // Controlled sync: respond to external shouldShow changes
  useEffect(() => {
    if (shouldShow === undefined) return;

    if (isVisibleRef.current !== shouldShow) {
      isVisibleRef.current = shouldShow;
      setIsVisible(shouldShow);
      onOpenChangeRef.current?.(shouldShow);
    }

    if (shouldShow) {
      editor.getEditorState().read(() => {
        updatePosition();
      });
    }
  }, [shouldShow, editor, updatePosition]);

  // Escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isVisibleRef.current) {
        e.preventDefault();
        isVisibleRef.current = false;
        setIsVisible(false);
        onOpenChangeRef.current?.(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [closeOnEscape]);

  return { elemRef, isVisible };
}
