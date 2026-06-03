import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { RefObject } from "react";
import { cn } from "../lib/cn";

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
   */
  placeholder?: string;

  /**
   * Ref to the editor container element
   */
  editorRef?:
    | ((instance: HTMLDivElement | null) => void)
    | RefObject<HTMLDivElement>;

  /**
   * Custom class names for different editor layers
   */
  classNames?: RichTextClassNames;
}

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
