// Text formatting

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

// Font size
export {
  decrementFontSize,
  getFontSize,
  incrementFontSize,
  setFontSize,
} from "./font-size";
// History
export { redo, undo } from "./history";
// State
export {
  getActiveFormats,
  getBlockType,
  isActive,
  isBlockActive,
} from "./state";
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

export { toggleLink } from "./link";
