// ─── React-specific ──────────────────────────────────────────────────────────

// Editor shell
export { EditorRoot, type EditorRootProps } from "./editor-root";
export {
  type ContextShape,
  SharedHistoryContext,
  useSharedHistoryContext,
} from "./editor-root/history-context";

// Editor content
export { EditorContent, type EditorContentProps } from "./editor-content";

// Contexts
export {
  TypixEditorContext,
  type TypixEditorContextValue,
  TypixEditorProvider,
  useTypixEditor,
} from "./editor-context";
export {
  RootContext,
  type RootContextShape,
  useRootContext,
} from "./root-context";

// Floating element
export {
  FloatingElement,
  type FloatingElementProps,
  useFloatingElement,
  type UseFloatingElementOptions,
} from "./floating-element";

// Bubble menu
export {
  EditorBubbleMenu,
  type EditorBubbleMenuProps,
  EditorBubbleItem,
  type EditorBubbleItemProps,
} from "./bubble-menu";

// Command menu
export {
  type CommandConfig,
  type CommandMenuItemConfig,
  type CommandMenuOption,
  createCommand,
  EditorCommand,
  type EditorCommandProps,
  EditorCommandItem,
  type EditorCommandItemBaseProps,
  type EditorCommandItemRenderProps,
  EditorCommandList,
  type EditorCommandListProps,
  EditorCommandEmpty,
  type EditorCommandEmptyProps,
  type EditorCommandContextValue,
  EditorCommandProvider,
  useEditorCommand,
} from "./command-menu";

// Suggestion menu
export {
  SuggestionMenu,
  useSuggestionItems,
  filterSuggestionItems,
  buildSuggestionTriggerFn,
  type SuggestionItem,
  type SuggestionMenuProps,
  type SuggestionMenuRenderProps,
  type SuggestionSelectProps,
} from "./suggestion-menu";

// Hooks
export { useEditorState } from "./hooks/use-editor-state";
export { useTypixEditorState } from "./hooks/use-typix-editor-state";
export { useSelectionStyle } from "./hooks/use-selection-style";
export { useSignal } from "./hooks/use-signal";
export { useMouseListener } from "./hooks/use-mouse-listener";
export { useRange } from "./hooks/use-range";

// Theme
export { defaultTheme } from "./theme";

// Lexical React plugins (re-exported for design system consumers)
export { DraggableBlockPlugin_EXPERIMENTAL as DraggableBlockPlugin } from "@lexical/react/LexicalDraggableBlockPlugin";
export {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  type MenuTextMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";

// Extension API
export {
  LexicalExtensionComposer,
  type LexicalExtensionComposerProps,
} from "@lexical/react/LexicalExtensionComposer";
export { buildEditorFromExtensions } from "@lexical/extension";
