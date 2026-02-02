import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useEditor } from "../../hooks/useEditor";
import { useRootContext } from "../../context/root";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  hide,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react-dom";
import { useRange } from "../../hooks/useRange";
import { useMouseListener } from "../../hooks/useMouseListener";
import { cn } from "../../utils";

interface EditorBubbleMenuProps {
  children?: React.ReactNode;

  /**
   * CSS class name for the content container
   */
  className?: string;
}

/**
 * Editor content wrapper with change event handling.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 *
 * <EditorBubbleMenu
 *   ref={ref}
 *   onChange={(state) => console.log(state)}
 * >
 *   <RichTextPlugin ... />
 * </EditorBubbleMenu>
 * ```
 */

const PADDING = 20;
const MARGIN_X = 32;

const EditorBubbleMenu = forwardRef<HTMLDivElement, EditorBubbleMenuProps>(
  ({ children, className }, ref) => {
    const { editor } = useEditor();
    const rootElement = editor.getRootElement();
    const { floatingAnchorElem } = useRootContext();
    const [fullWidth, setFullWidth] = useState(false);

    const {
      refs: { setReference, setFloating },
      strategy,
      x,
      y,
    } = useFloating({
      strategy: "fixed",
      placement: "top",
      middleware: [
        offset(10),
        hide({ padding: PADDING }),
        shift({ padding: PADDING, limiter: limitShift() }),
        size({ padding: PADDING }),
      ],
      whileElementsMounted: (...args) => {
        return autoUpdate(...args, {
          animationFrame: true,
        });
      },
    });

    // Pass position of current selection to floating ui
    const { range, rangeRef } = useRange();

    useLayoutEffect(() => {
      setReference({
        getBoundingClientRect: () =>
          range?.getBoundingClientRect() || new DOMRect(),
      });
    }, [setReference, range]);

    // When menu closed, go back to narrow width
    useEffect(() => {
      if (range === null) {
        setFullWidth(false);
      }
    }, [range]);

    // Don't show toolbar when mouse is down and creating a new selection
    const [creatingMouseSelection, setCreatingMouseSelection] = useState(false);

    useMouseListener((mouse) => {
      requestAnimationFrame(() => {
        setCreatingMouseSelection(
          mouse === "down" && rangeRef.current === null
        );
      });
    });

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        setFloating(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref, setFloating]
    );

    if (!floatingAnchorElem || range === null || creatingMouseSelection) {
      return null;
    }

    return createPortal(
      editor.isEditable() ? (
        <div
          ref={setRefs}
          style={
            fullWidth && rootElement
              ? {
                  position: strategy,
                  top: 0,
                  left: rootElement.getBoundingClientRect().left + MARGIN_X,
                  transform: `translate3d(0, ${Math.round(y)}px, 0)`,
                  width:
                    rootElement.getBoundingClientRect().width - MARGIN_X * 2,
                }
              : {
                  position: strategy,
                  top: 0,
                  left: 0,
                  transform: `translate3d(${Math.round(x)}px, ${Math.round(
                    y
                  )}px, 0)`,
                  minWidth: "max-content",
                }
          }
          className={cn("typix-editor-bubble-menu", className)}
        >
          {children}
        </div>
      ) : null,
      floatingAnchorElem as HTMLElement
    );
  }
);

EditorBubbleMenu.displayName = "Typix.EditorBubbleMenu";

export { EditorBubbleMenu, type EditorBubbleMenuProps };
