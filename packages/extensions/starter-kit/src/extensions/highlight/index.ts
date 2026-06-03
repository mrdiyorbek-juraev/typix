import {
  $getSelection,
  $isRangeSelection,
  defineExtension,
  safeCast,
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
} from "lexical";
import { $patchStyleText } from "@typix-editor/core/lexical/selection";
import { withTypixMeta } from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface HighlightConfig {
  disabled?: boolean;
}

export const TYPIX_TOGGLE_HIGHLIGHT = createCommand<void>(
  "TYPIX_TOGGLE_HIGHLIGHT"
);
export const TYPIX_SET_HIGHLIGHT_COLOR = createCommand<{ color: string }>(
  "TYPIX_SET_HIGHLIGHT_COLOR"
);
export const TYPIX_REMOVE_HIGHLIGHT_COLOR = createCommand<void>(
  "TYPIX_REMOVE_HIGHLIGHT_COLOR"
);

export const HighlightExtension = withTypixMeta(
  defineExtension({
    name: "@typix/highlight",
    config: safeCast<HighlightConfig>({ disabled: false }),
    mergeConfig(
      a: HighlightConfig,
      b: Partial<HighlightConfig>
    ): HighlightConfig {
      return { ...a, ...b };
    },
    build(_editor: LexicalEditor, config: HighlightConfig) {
      return namedSignals(config);
    },
    register(editor: LexicalEditor, _config: HighlightConfig, state: any) {
      const { disabled } = state.getOutput();
      return effect(() => {
        if (disabled?.value) return;
        const d1 = editor.registerCommand(
          TYPIX_TOGGLE_HIGHLIGHT,
          () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
            return true;
          },
          COMMAND_PRIORITY_EDITOR
        );
        const d2 = editor.registerCommand(
          TYPIX_SET_HIGHLIGHT_COLOR,
          ({ color }) => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "background-color": color });
              }
            });
            return true;
          },
          COMMAND_PRIORITY_EDITOR
        );
        const d3 = editor.registerCommand(
          TYPIX_REMOVE_HIGHLIGHT_COLOR,
          () => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "background-color": "" });
              }
            });
            return true;
          },
          COMMAND_PRIORITY_EDITOR
        );
        return () => {
          d1();
          d2();
          d3();
        };
      });
    },
  }),
  {
    commands: () => ({
      toggleHighlight: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_TOGGLE_HIGHLIGHT, undefined),
      setHighlightColor:
        (attrs: { color: string }) => (editor: LexicalEditor) =>
          editor.dispatchCommand(TYPIX_SET_HIGHLIGHT_COLOR, attrs),
      removeHighlightColor: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_REMOVE_HIGHLIGHT_COLOR, undefined),
    }),
  }
);

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    toggleHighlight(): R;
    setHighlightColor(attrs: { color: string | undefined }): R;
    removeHighlightColor(): R;
  }
}
