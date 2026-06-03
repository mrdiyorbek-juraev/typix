// ─── @typix-editor/react — public API ─────────────────────────────────────────

// Editor creation (hook)
export {
  useTypixEditor,
  type UseTypixEditorOptions,
} from "./hooks/use-typix-editor";

// Editor context + reader
export {
  TypixEditorContext,
  type TypixEditorContextValue,
} from "./editor-context";
export { useCurrentTypixEditor } from "./hooks/use-current-typix-editor";

// Provider (convenience wrapper combining the hook + context)
export {
  TypixEditorProvider,
  type TypixEditorProviderProps,
} from "./editor-provider";

// Editor content (renders the editable surface)
export { EditorContent, type EditorContentProps } from "./editor-content";

// Root context (for floating UI positioning)
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

// Lexical React plugin re-exports (for downstream consumers that need them)
export { DraggableBlockPlugin_EXPERIMENTAL as DraggableBlockPlugin } from "@lexical/react/LexicalDraggableBlockPlugin";
export {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  type MenuTextMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";

// Lexical extension building blocks (for custom advanced bootstrap)
export { buildEditorFromExtensions } from "@lexical/extension";
