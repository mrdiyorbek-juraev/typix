// ─── Core re-export (backward compat — consumers get all core APIs from react) ─
export * from "@typix-editor/core";

// ─── React-specific ───────────────────────────────────────────────────────────
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
  useActiveFormats,
  useBlockType,
  useEditorState,
  useMouseListener,
  useRange,
} from "./hooks";

export { defaultExtensionNodes } from "./shared";
export { defaultTheme } from "./theme";
export type { TypixExtension } from "./types";

// React-only utilities not in core
export { cn } from "./utils/classnames";
export {
  findFirstFocusableDescendant,
  focusNearestDescendant,
  isKeyboardInput,
} from "./utils/focus-utils";

// Extension API
export {
  LexicalExtensionComposer,
  type LexicalExtensionComposerProps,
} from "@lexical/react/LexicalExtensionComposer";
export {
  configExtension,
  declarePeerDependency,
  defineExtension,
  safeCast,
} from "lexical";
export { buildEditorFromExtensions } from "@lexical/extension";
