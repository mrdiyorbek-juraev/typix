import {
  $getSelection,
  $isRangeSelection,
  defineExtension,
  safeCast,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
} from "lexical";
import { $patchStyleText } from "@typix-editor/core/lexical/selection";
import { registerTypixMeta } from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface TextColorConfig {
  disabled?: boolean;
}

export const TYPIX_SET_TEXT_COLOR = createCommand<{ color: string }>(
  "TYPIX_SET_TEXT_COLOR"
);
export const TYPIX_REMOVE_TEXT_COLOR = createCommand<void>(
  "TYPIX_REMOVE_TEXT_COLOR"
);

export const TextColorExtension = defineExtension({
  name: "@typix/text-color",
  config: safeCast<TextColorConfig>({ disabled: false }),
  mergeConfig(
    a: TextColorConfig,
    b: Partial<TextColorConfig>
  ): TextColorConfig {
    return { ...a, ...b };
  },
  build(_editor: LexicalEditor, config: TextColorConfig) {
    return namedSignals(config);
  },
  register(editor: LexicalEditor, _config: TextColorConfig, state: any) {
    const { disabled } = state.getOutput();
    return effect(() => {
      if (disabled?.value) return;
      const d1 = editor.registerCommand(
        TYPIX_SET_TEXT_COLOR,
        ({ color }) => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $patchStyleText(selection, { color });
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );
      const d2 = editor.registerCommand(
        TYPIX_REMOVE_TEXT_COLOR,
        () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $patchStyleText(selection, { color: "" });
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );
      return () => {
        d1();
        d2();
      };
    });
  },
});

registerTypixMeta(TextColorExtension, {
  commands: {
    setTextColor: TYPIX_SET_TEXT_COLOR,
    removeTextColor: TYPIX_REMOVE_TEXT_COLOR,
  },
});

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    setTextColor(attrs: { color: string | undefined }): R;
    removeTextColor(): R;
  }
}
