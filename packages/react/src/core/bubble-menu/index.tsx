import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  getDOMSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRootContext } from "../../context/root";
import { cn } from "../../utils";
import { getDOMRangeRect } from "../../utils/dom-range-rect";
import { setFloatingElemPosition } from "../../utils/floating-element-position";

interface EditorBubbleMenuProps {
  children?: React.ReactNode;

  /**
   * CSS class name for the content container
   */
  className?: string;

  /**
   * Vertical gap between the selection and the menu in pixels.
   * @default 10
   */
  verticalGap?: number;

  /**
   * Horizontal offset from the selection in pixels.
   * @default 5
   */
  horizontalOffset?: number;
}

/**
 * A floating bubble menu that appears near the current text selection.
 * Automatically positions itself based on available space - shows above
 * the selection by default, flips below if there's not enough space above.
 *
 * @example
 * ```tsx
 * <EditorBubbleMenu verticalGap={8}>
 *   <BoldButton />
 *   <ItalicButton />
 * </EditorBubbleMenu>
 * ```
 */
const EditorBubbleMenu = forwardRef<HTMLDivElement, EditorBubbleMenuProps>(
  ({ children, className, verticalGap = 10, horizontalOffset = 5 }, ref) => {
    const [editor] = useLexicalComposerContext();
    const { floatingAnchorElem } = useRootContext();
    const popupRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const updatePosition = useCallback(() => {
      const selection = $getSelection();
      const popupElem = popupRef.current;
      const nativeSelection = getDOMSelection(editor._window);

      if (popupElem === null) {
        return;
      }

      const rootElement = editor.getRootElement();

      if (
        selection !== null &&
        nativeSelection !== null &&
        !nativeSelection.isCollapsed &&
        rootElement !== null &&
        rootElement.contains(nativeSelection.anchorNode)
      ) {
        const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

        setFloatingElemPosition(
          rangeRect,
          popupElem,
          floatingAnchorElem,
          false,
          verticalGap,
          horizontalOffset
        );
      }
    }, [editor, floatingAnchorElem, verticalGap, horizontalOffset]);

    const updateVisibility = useCallback(() => {
      editor.getEditorState().read(() => {
        if (editor.isComposing()) {
          return;
        }

        const selection = $getSelection();
        const nativeSelection = getDOMSelection(editor._window);
        const rootElement = editor.getRootElement();

        if (
          nativeSelection !== null &&
          (!$isRangeSelection(selection) ||
            rootElement === null ||
            !rootElement.contains(nativeSelection.anchorNode))
        ) {
          setIsVisible(false);
          return;
        }

        if (!$isRangeSelection(selection)) {
          setIsVisible(false);
          return;
        }

        const rawTextContent = selection.getTextContent().replace(/\n/g, "");
        if (selection.isCollapsed() || rawTextContent === "") {
          setIsVisible(false);
          return;
        }

        setIsVisible(true);
      });
    }, [editor]);

    // Handle mouse drag to disable pointer events during selection
    useEffect(() => {
      const popupElem = popupRef.current;
      if (!popupElem) return;

      function mouseMoveListener(e: MouseEvent) {
        if (
          popupRef.current &&
          (e.buttons === 1 || e.buttons === 3) &&
          popupRef.current.style.pointerEvents !== "none"
        ) {
          const x = e.clientX;
          const y = e.clientY;
          const elementUnderMouse = document.elementFromPoint(x, y);

          if (!popupRef.current.contains(elementUnderMouse)) {
            popupRef.current.style.pointerEvents = "none";
          }
        }
      }

      function mouseUpListener() {
        if (
          popupRef.current &&
          popupRef.current.style.pointerEvents !== "auto"
        ) {
          popupRef.current.style.pointerEvents = "auto";
        }
      }

      document.addEventListener("mousemove", mouseMoveListener);
      document.addEventListener("mouseup", mouseUpListener);

      return () => {
        document.removeEventListener("mousemove", mouseMoveListener);
        document.removeEventListener("mouseup", mouseUpListener);
      };
    }, []);

    // Update position on scroll and resize
    useEffect(() => {
      const scrollerElem = floatingAnchorElem?.parentElement;

      const update = () => {
        editor.getEditorState().read(() => {
          updatePosition();
        });
      };

      window.addEventListener("resize", update);
      if (scrollerElem) {
        scrollerElem.addEventListener("scroll", update);
      }

      return () => {
        window.removeEventListener("resize", update);
        if (scrollerElem) {
          scrollerElem.removeEventListener("scroll", update);
        }
      };
    }, [editor, updatePosition, floatingAnchorElem]);

    // Listen for selection changes and editor updates
    useEffect(() => {
      document.addEventListener("selectionchange", updateVisibility);
      return () => {
        document.removeEventListener("selectionchange", updateVisibility);
      };
    }, [updateVisibility]);

    useEffect(
      () =>
        mergeRegister(
          editor.registerUpdateListener(() => {
            updateVisibility();
          }),
          editor.registerRootListener(() => {
            if (editor.getRootElement() === null) {
              setIsVisible(false);
            }
          })
        ),
      [editor, updateVisibility]
    );

    // Update position when visible
    useEffect(() => {
      if (isVisible) {
        editor.getEditorState().read(() => {
          updatePosition();
        });
      }
    }, [isVisible, editor, updatePosition]);

    useEffect(
      () =>
        mergeRegister(
          editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
              updatePosition();
            });
          }),
          editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
              updatePosition();
              return false;
            },
            COMMAND_PRIORITY_LOW
          )
        ),
      [editor, updatePosition]
    );

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        popupRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    if (!(floatingAnchorElem && isVisible && editor.isEditable())) {
      return null;
    }

    return createPortal(
      <div
        className={cn("typix-editor-bubble-menu", className)}
        ref={setRefs}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0,
          willChange: "transform",
        }}
      >
        {children}
      </div>,
      floatingAnchorElem
    );
  }
);

EditorBubbleMenu.displayName = "Typix.EditorBubbleMenu";

export { EditorBubbleMenu, type EditorBubbleMenuProps };
