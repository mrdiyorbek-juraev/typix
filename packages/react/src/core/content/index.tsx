import { forwardRef } from "react";
import { useRootContext } from "../../context/root";
import { RichTextExtension } from "./rich-text";

interface EditorContentProps {
  children?: React.ReactNode;

  placeholder?: string;

  /**
   * CSS class name for the content container
   */
  className?: string;

  classNames?: {
    scroller?: string;
    container?: string;
    contentEditable?: string;
    placeholder?: string;
  };
}

/**
 * Editor content wrapper with change event handling.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 *
 * <EditorContent
 *   ref={ref}
 *   onChange={(state) => console.log(state)}
 * >
 *   <RichTextPlugin ... />
 * </EditorContent>
 * ```
 */
const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
  ({ children, className, placeholder, classNames }, ref) => {
    const { setFloatingAnchorElem } = useRootContext();

    const onRef = (_floatingAnchorElem: HTMLDivElement | null): void => {
      if (_floatingAnchorElem !== null) {
        setFloatingAnchorElem(_floatingAnchorElem);
      }
    };
    return (
      <div className={className} ref={ref}>
        {children}
        <RichTextExtension
          classNames={classNames}
          editorRef={onRef}
          placeholder={placeholder}
        />
      </div>
    );
  }
);

EditorContent.displayName = "Typix.EditorContent";

export { EditorContent, type EditorContentProps };
