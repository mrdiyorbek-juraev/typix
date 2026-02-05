import type {
  LexicalEditor,
  SerializedEditorState,
  TextFormatType,
} from "lexical";
import * as commands from "./commands";
import type { BlockType, ElementAlignment, HeadingLevel } from "./constants";

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
 *
 * // Export content
 * const html = editor.getHTML();
 * const json = editor.getJSON();
 * ```
 */
export class TypixEditor {
  /** @internal */
  readonly _lexicalEditor: LexicalEditor;

  constructor(lexicalEditor: LexicalEditor) {
    this._lexicalEditor = lexicalEditor;
  }

  /**
   * Access the underlying Lexical editor instance.
   * Use this for advanced operations not covered by TypixEditor API.
   */
  get lexical(): LexicalEditor {
    return this._lexicalEditor;
  }

  // ============================================
  // TEXT FORMAT
  // ============================================

  toggleFormat(format: TextFormatType): this {
    commands.toggleFormat(this._lexicalEditor, format);
    return this;
  }

  toggleBold(): this {
    commands.toggleBold(this._lexicalEditor);
    return this;
  }

  toggleItalic(): this {
    commands.toggleItalic(this._lexicalEditor);
    return this;
  }

  toggleUnderline(): this {
    commands.toggleUnderline(this._lexicalEditor);
    return this;
  }

  toggleStrikethrough(): this {
    commands.toggleStrikethrough(this._lexicalEditor);
    return this;
  }

  toggleCode(): this {
    commands.toggleCode(this._lexicalEditor);
    return this;
  }

  toggleSubscript(): this {
    commands.toggleSubscript(this._lexicalEditor);
    return this;
  }

  toggleSuperscript(): this {
    commands.toggleSuperscript(this._lexicalEditor);
    return this;
  }

  toggleHighlight(): this {
    commands.toggleHighlight(this._lexicalEditor);
    return this;
  }

  clearFormatting(): this {
    commands.clearFormatting(this._lexicalEditor);
    return this;
  }

  // ============================================
  // BLOCK FORMAT
  // ============================================

  toggleHeading({ level }: { level: HeadingLevel }): this {
    commands.toggleHeading(this._lexicalEditor, level);
    return this;
  }

  setParagraph(): this {
    commands.setParagraph(this._lexicalEditor);
    return this;
  }

  toggleBulletList(): this {
    commands.toggleBulletList(this._lexicalEditor);
    return this;
  }

  toggleOrderedList(): this {
    commands.toggleOrderedList(this._lexicalEditor);
    return this;
  }

  toggleCheckList(): this {
    commands.toggleCheckList(this._lexicalEditor);
    return this;
  }

  toggleQuote(): this {
    commands.toggleQuote(this._lexicalEditor);
    return this;
  }

  toggleCodeBlock(language?: string): this {
    commands.toggleCodeBlock(this._lexicalEditor, language);
    return this;
  }

  // ============================================
  // ALIGNMENT
  // ============================================

  formatAlign(alignment: ElementAlignment): this {
    commands.formatAlign(this._lexicalEditor, alignment);
    return this;
  }

  alignLeft(): this {
    commands.alignLeft(this._lexicalEditor);
    return this;
  }

  alignCenter(): this {
    commands.alignCenter(this._lexicalEditor);
    return this;
  }

  alignRight(): this {
    commands.alignRight(this._lexicalEditor);
    return this;
  }

  alignJustify(): this {
    commands.alignJustify(this._lexicalEditor);
    return this;
  }

  alignStart(): this {
    commands.alignStart(this._lexicalEditor);
    return this;
  }

  alignEnd(): this {
    commands.alignEnd(this._lexicalEditor);
    return this;
  }

  // ============================================
  // HISTORY
  // ============================================

  undo(): this {
    commands.undo(this._lexicalEditor);
    return this;
  }

  redo(): this {
    commands.redo(this._lexicalEditor);
    return this;
  }

  // ============================================
  // STATE
  // ============================================

  isActive(format: TextFormatType): boolean {
    return commands.isActive(this._lexicalEditor, format);
  }

  getActiveFormats(): Set<TextFormatType> {
    return commands.getActiveFormats(this._lexicalEditor);
  }

  isBlockActive(blockType: BlockType): boolean {
    return commands.isBlockActive(this._lexicalEditor, blockType);
  }

  getBlockType(): BlockType | null {
    return commands.getBlockType(this._lexicalEditor);
  }

  // ============================================
  // FONT SIZE
  // ============================================

  setFontSize(size: number): this {
    commands.setFontSize(this._lexicalEditor, size);
    return this;
  }

  getFontSize(): number {
    return commands.getFontSize(this._lexicalEditor);
  }

  incrementFontSize(step = 1): this {
    commands.incrementFontSize(this._lexicalEditor, step);
    return this;
  }

  decrementFontSize(step = 1): this {
    commands.decrementFontSize(this._lexicalEditor, step);
    return this;
  }

  // ============================================
  // CONTENT EXPORT
  // ============================================

  getJSON(): SerializedEditorState {
    return commands.getJSON(this._lexicalEditor);
  }

  getHTML(): string {
    return commands.getHTML(this._lexicalEditor);
  }

  getMarkdown(): string {
    return commands.getMarkdown(this._lexicalEditor);
  }

  getText(): string {
    return commands.getText(this._lexicalEditor);
  }

  // ============================================
  // CONTENT IMPORT
  // ============================================

  setJSON(json: SerializedEditorState): this {
    commands.setJSON(this._lexicalEditor, json);
    return this;
  }

  setHTML(html: string): this {
    commands.setHTML(this._lexicalEditor, html);
    return this;
  }

  setMarkdown(markdown: string): this {
    commands.setMarkdown(this._lexicalEditor, markdown);
    return this;
  }

  clearContent(): this {
    commands.clearContent(this._lexicalEditor);
    return this;
  }

  // ============================================
  // EDITOR CONTROL
  // ============================================

  focus(): this {
    commands.focus(this._lexicalEditor);
    return this;
  }

  blur(): this {
    commands.blur(this._lexicalEditor);
    return this;
  }

  isEditable(): boolean {
    return commands.isEditable(this._lexicalEditor);
  }

  setEditable(editable: boolean): this {
    commands.setEditable(this._lexicalEditor, editable);
    return this;
  }

  /**
   * Execute a read operation on the editor state.
   */
  read<T>(callback: () => T): T {
    return this._lexicalEditor.getEditorState().read(callback);
  }

  /**
   * Execute an update operation on the editor.
   */
  update(callback: () => void): this {
    this._lexicalEditor.update(callback);
    return this;
  }

  /**
   * Register a listener for editor updates.
   */
  onUpdate(
    callback: Parameters<LexicalEditor["registerUpdateListener"]>[0]
  ): () => void {
    return this._lexicalEditor.registerUpdateListener(callback);
  }
}
