export { cn } from "./cn/index";
export { sanitizeUrl, validateUrl } from "./url/index";
export { getDOMRangeRect } from "./dom-range-rect/index";
export { setFloatingElemPosition } from "./floating-element-position/index";
export { setFloatingElemPositionForLinkEditor } from "./floating-element-position-for-link/index";
export {
  addSwipeDownListener,
  addSwipeLeftListener,
  addSwipeRightListener,
  addSwipeUpListener,
} from "./swipe/index";

// ─────────────────────────────────────────────────────
// Server-side utilities
// ─────────────────────────────────────────────────────
export {
  clearDocumentState,
  initializeDocumentState,
  validateEditorState,
} from "./server/validation";

export {$findMatchingParent, mergeRegister} from "./lexical/utils";
export { getSelectedNode } from "./lexical/selected-node/index";
export { getThemeSelector } from "./lexical/theme-selector/index";
