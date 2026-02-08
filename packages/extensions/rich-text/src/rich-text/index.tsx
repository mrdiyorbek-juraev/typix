import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { cn } from "@typix-editor/react";
import type { RefObject } from "react";

/**
 * Class names for different parts of the RichText editor
 */
interface RichTextClassNames {
  /**
   * Outer scrollable container wrapper
   * @example "max-h-screen overflow-auto"
   */
  scroller?: string;

  /**
   * Editor container that holds the contentEditable
   * @example "relative min-h-[200px] px-4 py-2"
   */
  container?: string;

  /**
   * ContentEditable element where user types
   * @example "outline-none focus:outline-none"
   */
  contentEditable?: string;

  /**
   * Placeholder element shown when editor is empty
   * @example "text-gray-400 pointer-events-none"
   */
  placeholder?: string;
}

/**
 * Props for the RichText extension component
 */
interface RichTextExtensionProps {
  /**
   * Placeholder text displayed when the editor is empty
   * @default ""
   * @example "Start typing..."
   */
  placeholder?: string;

  /**
   * Ref to the editor container element
   * Useful for measurements, portals, or imperative DOM operations
   * @example
   * ```tsx
   * const editorRef = useRef<HTMLDivElement>(null);
   * <RichTextExtension editorRef={editorRef} />
   * ```
   */
  editorRef?:
    | ((instance: HTMLDivElement | null) => void)
    | RefObject<HTMLDivElement>;

  /**
   * Custom class names for different editor layers
   * Allows fine-grained styling control over each part of the editor
   * @example
   * ```tsx
   * <RichTextExtension
   *   classNames={{
   *     scroller: "max-h-[600px] overflow-y-auto",
   *     container: "p-4 min-h-[200px]",
   *     contentEditable: "prose prose-slate",
   *     placeholder: "text-muted-foreground"
   *   }}
   * />
   * ```
   */
  classNames?: RichTextClassNames;
}

/**
 * RichTextExtension - A wrapper around Lexical's RichTextPlugin with enhanced styling options
 *
 * This component provides a flexible, fully-styled rich text editing experience with
 * fine-grained control over styling at each layer of the editor hierarchy.
 *
 * @component
 * @example
 * Basic usage:
 * ```tsx
 * <RichTextExtension placeholder="Write something amazing..." />
 * ```
 *
 * @example
 * With custom styling:
 * ```tsx
 * <RichTextExtension
 *   placeholder="Start typing..."
 *   classNames={{
 *     scroller: "h-[500px] overflow-y-auto border rounded-lg",
 *     container: "p-6 prose prose-lg max-w-none",
 *     contentEditable: "focus:outline-none",
 *     placeholder: "text-gray-400 italic"
 *   }}
 * />
 * ```
 *
 * @example
 * With ref for advanced control:
 * ```tsx
 * const editorRef = useRef<HTMLDivElement>(null);
 *
 * useEffect(() => {
 *   if (editorRef.current) {
 *     // Measure editor height, attach portals, etc.
 *     console.log(editorRef.current.getBoundingClientRect());
 *   }
 * }, []);
 *
 * <RichTextExtension
 *   editorRef={editorRef}
 *   placeholder="Type here..."
 * />
 * ```
 *
 * @remarks
 * The component uses Lexical's RichTextPlugin internally and provides a structured
 * DOM hierarchy: Scroller → Container → ContentEditable + Placeholder
 *
 * Each layer can be styled independently through the `classNames` prop, allowing
 * for complete control over the editor's appearance without needing to override
 * internal styles.
 */
const RichTextExtension = ({
  placeholder = "",
  editorRef,
  classNames,
}: RichTextExtensionProps) => (
  <RichTextPlugin
    contentEditable={
      <div className={cn("typix-editor-scroller", classNames?.scroller)}>
        <div
          className={cn("typix-editor", classNames?.container)}
          ref={editorRef}
        >
          <ContentEditable
            aria-placeholder={placeholder}
            className={cn(
              "typix-editor-contenteditable",
              classNames?.contentEditable
            )}
            placeholder={
              <div
                className={cn(
                  "typix-editor-placeholder",
                  classNames?.placeholder
                )}
              >
                {placeholder}
              </div>
            }
          />
        </div>
      </div>
    }
    ErrorBoundary={LexicalErrorBoundary}
  />
);

RichTextExtension.displayName = "Typix.RichTextExtension";

export type { RichTextExtensionProps, RichTextClassNames };
export { RichTextExtension };
