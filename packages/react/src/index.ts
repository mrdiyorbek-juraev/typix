export {
  type CommandConfig,
  type CreateEditorConfigOptions,
  createCommand,
  createEditorConfig,
} from "./config";

export {
  type ContextShape,
  type EditorCommandContextValue,
  EditorCommandProvider,
  RootContext,
  type RootContextShape,
  SharedHistoryContext,
  TypixEditorContext,
  type TypixEditorContextValue,
  TypixEditorProvider,
  useEditorCommand,
  useRootContext,
  useSharedHistoryContext,
  useTypixEditor,
} from "./context";

export {
  type CommandMenuItemConfig,
  type CommandMenuOption,
  EditorBubbleItem,
  type EditorBubbleItemProps,
  EditorBubbleMenu,
  type EditorBubbleMenuProps,
  EditorCommand,
  EditorCommandEmpty,
  type EditorCommandEmptyProps,
  EditorCommandItem,
  type EditorCommandItemBaseProps,
  type EditorCommandItemRenderProps,
  EditorCommandList,
  type EditorCommandListProps,
  type EditorCommandProps,
  EditorContent,
  type EditorContentProps,
  EditorRoot,
  type EditorRootProps,
} from "./core";

export {
  type BlockType,
  type HeadingLevel,
  TEXT_FORMAT_TYPES,
  TypixEditor,
} from "./editor";

export {
  useActiveFormats,
  useEditorState,
  useMouseListener,
  useRange,
} from "./hooks";

export type { Klass, LexicalNode, LexicalNodeReplacement } from "./lib";
export { defaultExtensionNodes } from "./shared";
export { defaultTheme } from "./theme";
// Re-export types for direct access
export type { LexicalEditor, TextFormatType, TypixExtension } from "./types";

export {
  addSwipeRightListener,
  cn,
  findFirstFocusableDescendant,
  focusNearestDescendant,
  isKeyboardInput,
  sanitizeUrl,
  validateUrl,
  getSelectedNode,
  setFloatingElemPositionForLinkEditor,
  setFloatingElemPosition,
} from "./utils";
