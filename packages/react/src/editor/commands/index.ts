// Text formatting
export {
  clearFormatting,
  toggleBold,
  toggleCode,
  toggleFormat,
  toggleHighlight,
  toggleItalic,
  toggleStrikethrough,
  toggleSubscript,
  toggleSuperscript,
  toggleUnderline,
} from "./text-format";

// Block formatting
export {
  setParagraph,
  toggleBulletList,
  toggleCheckList,
  toggleCodeBlock,
  toggleHeading,
  toggleOrderedList,
  toggleQuote,
} from "./block-format";

// Alignment
export {
  alignCenter,
  alignEnd,
  alignJustify,
  alignLeft,
  alignRight,
  alignStart,
  formatAlign,
} from "./alignment";

// History
export { redo, undo } from "./history";

// Font size
export {
  decrementFontSize,
  getFontSize,
  incrementFontSize,
  setFontSize,
} from "./font-size";

// State
export {
  getActiveFormats,
  getBlockType,
  isActive,
  isBlockActive,
} from "./state";

// Content
export {
  clearContent,
  getHTML,
  getJSON,
  getMarkdown,
  getText,
  setHTML,
  setJSON,
  setMarkdown,
} from "./content";

// Control
export { blur, focus, isEditable, setEditable } from "./control";
