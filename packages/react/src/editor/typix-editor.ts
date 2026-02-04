import {
  type LexicalEditor,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $isTextNode,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  type TextFormatType,
} from "lexical";
import { $patchStyleText, $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { $getNearestNodeOfType } from "@lexical/utils";

/**
 * All available text format types
 */
export const TEXT_FORMAT_TYPES: TextFormatType[] = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "code",
  "subscript",
  "superscript",
  "highlight",
  "lowercase",
  "uppercase"
];

/**
 * Valid heading levels
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Block types for isActive checks
 */
export type BlockType =
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "bullet"
  | "number"
  | "check"
  | "quote"
  | "code";

/**
 * Font size constraints
 */
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 144;
export const DEFAULT_FONT_SIZE = 16;

/**
 * TypixEditor provides a clean, fluent API for editor operations.
 *
 * It wraps the Lexical editor instance and provides convenient methods
 * for common operations like toggling formats and checking active state.
 *
 * @example
 * ```tsx
 * const editor = useTypixEditor();
 *
 * // Toggle formatting
 * editor.toggleBold();
 * editor.toggleFormat('italic');
 *
 * // Check active state
 * if (editor.isActive('bold')) {
 *   console.log('Bold is active');
 * }
 * ```
 */
export class TypixEditor {
  private readonly _lexical: LexicalEditor;

  constructor(lexicalEditor: LexicalEditor) {
    this._lexical = lexicalEditor;
  }

  /**
   * Access the underlying Lexical editor instance.
   * Use this for advanced operations not covered by TypixEditor API.
   */
  get lexical(): LexicalEditor {
    return this._lexical;
  }

  // ============================================
  // TEXT FORMAT TOGGLES
  // ============================================

  /**
   * Toggle a text format on the current selection.
   *
   * @param format - The format type to toggle
   *
   * @example
   * ```tsx
   * editor.toggleFormat('bold');
   * editor.toggleFormat('italic');
   * ```
   */
  toggleFormat(format: TextFormatType): this {
    this._lexical.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    return this;
  }

  /**
   * Toggle bold formatting on the current selection.
   */
  toggleBold(): this {
    return this.toggleFormat("bold");
  }

  /**
   * Toggle italic formatting on the current selection.
   */
  toggleItalic(): this {
    return this.toggleFormat("italic");
  }

  /**
   * Toggle underline formatting on the current selection.
   */
  toggleUnderline(): this {
    return this.toggleFormat("underline");
  }

  /**
   * Toggle strikethrough formatting on the current selection.
   */
  toggleStrikethrough(): this {
    return this.toggleFormat("strikethrough");
  }

  /**
   * Toggle inline code formatting on the current selection.
   */
  toggleCode(): this {
    return this.toggleFormat("code");
  }

  /**
   * Toggle subscript formatting on the current selection.
   */
  toggleSubscript(): this {
    return this.toggleFormat("subscript");
  }

  /**
   * Toggle superscript formatting on the current selection.
   */
  toggleSuperscript(): this {
    return this.toggleFormat("superscript");
  }

  /**
   * Toggle highlight formatting on the current selection.
   */
  toggleHighlight(): this {
    return this.toggleFormat("highlight");
  }

  // ============================================
  // BLOCK FORMAT TOGGLES
  // ============================================

  /**
   * Toggle heading on the current selection.
   * If already a heading of the same level, converts to paragraph.
   *
   * @param options - Heading options with level (1-6)
   *
   * @example
   * ```tsx
   * editor.toggleHeading({ level: 1 }); // H1
   * editor.toggleHeading({ level: 2 }); // H2
   * ```
   */
  toggleHeading({ level }: { level: HeadingLevel }): this {
    const headingTag: HeadingTagType = `h${level}`;

    this._lexical.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getTopLevelElementOrThrow();
      const elementType = element.getType();
      const elementTag =
        elementType === "heading"
          ? (element as unknown as { getTag: () => string }).getTag()
          : null;

      // If already this heading level, convert to paragraph
      if (elementTag === headingTag) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => $createHeadingNode(headingTag));
      }
    });

    return this;
  }

  /**
   * Set the current block to a paragraph.
   *
   * @example
   * ```tsx
   * editor.setParagraph();
   * ```
   */
  setParagraph(): this {
    this._lexical.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
    return this;
  }

  /**
   * Toggle bullet (unordered) list on the current selection.
   * If already a bullet list, removes the list formatting.
   *
   * @example
   * ```tsx
   * editor.toggleBulletList();
   * ```
   */
  toggleBulletList(): this {
    if (this._isListActive("bullet")) {
      this._lexical.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      this._lexical.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
    return this;
  }

  /**
   * Toggle ordered (numbered) list on the current selection.
   * If already an ordered list, removes the list formatting.
   *
   * @example
   * ```tsx
   * editor.toggleOrderedList();
   * ```
   */
  toggleOrderedList(): this {
    if (this._isListActive("number")) {
      this._lexical.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      this._lexical.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
    return this;
  }

  /**
   * Toggle check list on the current selection.
   * If already a check list, removes the list formatting.
   *
   * @example
   * ```tsx
   * editor.toggleCheckList();
   * ```
   */
  toggleCheckList(): this {
    if (this._isListActive("check")) {
      this._lexical.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      this._lexical.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    }
    return this;
  }

  /**
   * Toggle blockquote on the current selection.
   * If already a quote, converts to paragraph.
   *
   * @example
   * ```tsx
   * editor.toggleQuote();
   * ```
   */
  toggleQuote(): this {
    this._lexical.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getTopLevelElementOrThrow();

      if ($isQuoteNode(element)) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
    return this;
  }

  /**
   * Toggle code block on the current selection.
   * If already a code block, converts to paragraph.
   *
   * @param language - Optional language for syntax highlighting
   *
   * @example
   * ```tsx
   * editor.toggleCodeBlock();
   * editor.toggleCodeBlock('typescript');
   * ```
   */
  toggleCodeBlock(language?: string): this {
    this._lexical.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getTopLevelElementOrThrow();

      if ($isCodeNode(element)) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () =>
          language ? $createCodeNode(language) : $createCodeNode()
        );
      }
    });
    return this;
  }

  /**
   * Internal helper to check if a list type is active.
   */
  private _isListActive(listType: "bullet" | "number" | "check"): boolean {
    return this._lexical.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return false;

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getTopLevelElementOrThrow();
      const listNode = $getNearestNodeOfType(element, ListNode);

      if (!listNode || !$isListNode(listNode)) return false;

      const listTagType = listNode.getListType();
      if (listType === "bullet") return listTagType === "bullet";
      if (listType === "number") return listTagType === "number";
      if (listType === "check") return listTagType === "check";
      return false;
    });
  }

  // ============================================
  // HISTORY (UNDO/REDO)
  // ============================================

  /**
   * Undo the last action.
   *
   * @example
   * ```tsx
   * editor.undo();
   * ```
   */
  undo(): this {
    this._lexical.dispatchCommand(UNDO_COMMAND, undefined);
    return this;
  }

  /**
   * Redo the last undone action.
   *
   * @example
   * ```tsx
   * editor.redo();
   * ```
   */
  redo(): this {
    this._lexical.dispatchCommand(REDO_COMMAND, undefined);
    return this;
  }

  // ============================================
  // STATE CHECKS
  // ============================================

  /**
   * Check if a format is currently active on the selection.
   *
   * This is a synchronous read of the current editor state.
   * For reactive updates, use the `useActiveFormats()` hook instead.
   *
   * @param format - The format type to check
   * @returns true if the format is active, false otherwise
   *
   * @example
   * ```tsx
   * if (editor.isActive('bold')) {
   *   // Bold is active
   * }
   * ```
   */
  isActive(format: TextFormatType): boolean {
    return this._lexical.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return false;
      }
      return selection.hasFormat(format);
    });
  }

  /**
   * Get all currently active formats on the selection.
   *
   * This is a synchronous read of the current editor state.
   * For reactive updates, use the `useActiveFormats()` hook instead.
   *
   * @returns Set of active format types
   *
   * @example
   * ```tsx
   * const formats = editor.getActiveFormats();
   * if (formats.has('bold') && formats.has('italic')) {
   *   // Both bold and italic are active
   * }
   * ```
   */
  getActiveFormats(): Set<TextFormatType> {
    return this._lexical.getEditorState().read(() => {
      const selection = $getSelection();
      const formats = new Set<TextFormatType>();

      if (!$isRangeSelection(selection)) {
        return formats;
      }

      for (const format of TEXT_FORMAT_TYPES) {
        if (selection.hasFormat(format)) {
          formats.add(format);
        }
      }

      return formats;
    });
  }

  /**
   * Check if a block type is currently active.
   *
   * @param blockType - The block type to check (h1-h6, bullet, number, paragraph)
   * @returns true if the block type is active, false otherwise
   *
   * @example
   * ```tsx
   * if (editor.isBlockActive('h1')) {
   *   // Heading 1 is active
   * }
   * if (editor.isBlockActive('bullet')) {
   *   // Bullet list is active
   * }
   * ```
   */
  isBlockActive(blockType: BlockType): boolean {
    return this._lexical.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return false;

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getTopLevelElementOrThrow();
      const elementType = element.getType();

      // Check for list types
      if (blockType === "bullet" || blockType === "number" || blockType === "check") {
        const listNode = $getNearestNodeOfType(element, ListNode);
        if (!listNode || !$isListNode(listNode)) return false;
        const listTagType = listNode.getListType();
        if (blockType === "bullet") return listTagType === "bullet";
        if (blockType === "number") return listTagType === "number";
        if (blockType === "check") return listTagType === "check";
        return false;
      }

      // Check for heading types
      if (blockType.startsWith("h")) {
        if (elementType !== "heading") return false;
        const tag = (element as unknown as { getTag: () => string }).getTag();
        return tag === blockType;
      }

      // Check for quote
      if (blockType === "quote") {
        return $isQuoteNode(element);
      }

      // Check for code block
      if (blockType === "code") {
        return $isCodeNode(element);
      }

      // Check for paragraph
      if (blockType === "paragraph") {
        return elementType === "paragraph";
      }

      return false;
    });
  }

  /**
   * Get the current block type.
   *
   * @returns The current block type or null if not determinable
   *
   * @example
   * ```tsx
   * const blockType = editor.getBlockType();
   * console.log(blockType); // 'paragraph', 'h1', 'bullet', etc.
   * ```
   */
  getBlockType(): BlockType | null {
    return this._lexical.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return null;

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getTopLevelElementOrThrow();
      const elementType = element.getType();

      // Check for list
      const listNode = $getNearestNodeOfType(element, ListNode);
      if (listNode && $isListNode(listNode)) {
        const listType = listNode.getListType();
        if (listType === "bullet") return "bullet";
        if (listType === "number") return "number";
        if (listType === "check") return "check";
      }

      // Check for quote
      if ($isQuoteNode(element)) {
        return "quote";
      }

      // Check for code block
      if ($isCodeNode(element)) {
        return "code";
      }

      // Check for heading
      if (elementType === "heading") {
        const tag = (element as unknown as { getTag: () => string }).getTag();
        return tag as BlockType;
      }

      // Default to paragraph
      if (elementType === "paragraph") {
        return "paragraph";
      }

      return null;
    });
  }

  // ============================================
  // FONT SIZE OPERATIONS
  // ============================================

  /**
   * Set the font size for the current selection.
   *
   * @param size - Font size in pixels (will be clamped to MIN_FONT_SIZE-MAX_FONT_SIZE)
   *
   * @example
   * ```tsx
   * editor.setFontSize(18);
   * editor.setFontSize(24);
   * ```
   */
  setFontSize(size: number): this {
    const clampedSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size));

    this._lexical.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-size": `${clampedSize}px` });
      }
    });
    return this;
  }

  /**
   * Get the current font size from the selection.
   *
   * @returns Font size in pixels or DEFAULT_FONT_SIZE if not set
   *
   * @example
   * ```tsx
   * const size = editor.getFontSize();
   * console.log(size); // 16
   * ```
   */
  getFontSize(): number {
    return this._lexical.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return DEFAULT_FONT_SIZE;

      const anchor = selection.anchor.getNode();
      if (!$isTextNode(anchor)) return DEFAULT_FONT_SIZE;

      const style = anchor.getStyle() ?? "";
      const fontSize = style.match(/font-size:\s*(\d+)px/);
      return fontSize?.[1] ? parseInt(fontSize[1], 10) : DEFAULT_FONT_SIZE;
    });
  }

  /**
   * Increment the font size by a given step.
   *
   * @param step - Amount to increment (default: 1)
   *
   * @example
   * ```tsx
   * editor.incrementFontSize();     // +1
   * editor.incrementFontSize(2);    // +2
   * ```
   */
  incrementFontSize(step = 1): this {
    const currentSize = this.getFontSize();
    return this.setFontSize(currentSize + step);
  }

  /**
   * Decrement the font size by a given step.
   *
   * @param step - Amount to decrement (default: 1)
   *
   * @example
   * ```tsx
   * editor.decrementFontSize();     // -1
   * editor.decrementFontSize(2);    // -2
   * ```
   */
  decrementFontSize(step = 1): this {
    const currentSize = this.getFontSize();
    return this.setFontSize(currentSize - step);
  }

  // ============================================
  // CLEARING FORMATTING
  // ============================================

  /**
   * Clear all text formatting from the current selection.
   * This removes bold, italic, underline, strikethrough, code,
   * subscript, superscript, and highlight formatting.
   *
   * @example
   * ```tsx
   * editor.clearFormatting();
   * ```
   */
  clearFormatting(): this {
    this._lexical.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchor = selection.anchor;
      const focus = selection.focus;
      const nodes = selection.getNodes();

      if (anchor.key === focus.key && anchor.offset === focus.offset) {
        return;
      }

      for (const node of nodes) {
        if ($isTextNode(node)) {
          // Clear all text formats
          let textNode = node;
          for (const format of TEXT_FORMAT_TYPES) {
            if (textNode.hasFormat(format)) {
              textNode = textNode.toggleFormat(format);
            }
          }
          // Clear inline styles
          if (textNode.getStyle() !== "") {
            textNode.setStyle("");
          }
        }
      }
    });
    return this;
  }

  // ============================================
  // EDITOR CONTROL
  // ============================================

  /**
   * Focus the editor.
   */
  focus(): this {
    this._lexical.focus();
    return this;
  }

  /**
   * Blur the editor.
   */
  blur(): this {
    this._lexical.blur();
    return this;
  }

  /**
   * Check if the editor is editable.
   */
  isEditable(): boolean {
    return this._lexical.isEditable();
  }

  /**
   * Set the editable state of the editor.
   *
   * @param editable - Whether the editor should be editable
   */
  setEditable(editable: boolean): this {
    this._lexical.setEditable(editable);
    return this;
  }

  /**
   * Execute a read operation on the editor state.
   *
   * @param callback - Function to execute in read mode
   * @returns The result of the callback
   *
   * @example
   * ```tsx
   * const text = editor.read(() => {
   *   const selection = $getSelection();
   *   return selection?.getTextContent();
   * });
   * ```
   */
  read<T>(callback: () => T): T {
    return this._lexical.getEditorState().read(callback);
  }

  /**
   * Execute an update operation on the editor.
   *
   * @param callback - Function to execute in update mode
   *
   * @example
   * ```tsx
   * editor.update(() => {
   *   const selection = $getSelection();
   *   if ($isRangeSelection(selection)) {
   *     selection.insertText('Hello');
   *   }
   * });
   * ```
   */
  update(callback: () => void): this {
    this._lexical.update(callback);
    return this;
  }

  /**
   * Register a listener for editor updates.
   *
   * @param callback - Function called on each update
   * @returns Cleanup function to unregister the listener
   *
   * @example
   * ```tsx
   * useEffect(() => {
   *   return editor.onUpdate(({ editorState }) => {
   *     console.log('Editor updated');
   *   });
   * }, [editor]);
   * ```
   */
  onUpdate(
    callback: Parameters<LexicalEditor["registerUpdateListener"]>[0]
  ): () => void {
    return this._lexical.registerUpdateListener(callback);
  }
}
