import {
  defineExtension,
  safeCast,
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
} from "lexical";
import { withTypixMeta } from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface ItalicConfig {
  disabled?: boolean;
}

export const TYPIX_TOGGLE_ITALIC = createCommand<void>("TYPIX_TOGGLE_ITALIC");

export const ItalicExtension = withTypixMeta(
  defineExtension({
    name: "@typix/italic",
    config: safeCast<ItalicConfig>({ disabled: false }),
    mergeConfig(a: ItalicConfig, b: Partial<ItalicConfig>): ItalicConfig {
      return { ...a, ...b };
    },
    build(_editor: LexicalEditor, config: ItalicConfig) {
      return namedSignals(config);
    },
    register(editor: LexicalEditor, _config: ItalicConfig, state: any) {
      const { disabled } = state.getOutput();
      return effect(() => {
        if (disabled?.value) return;
        return editor.registerCommand(
          TYPIX_TOGGLE_ITALIC,
          () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            return true;
          },
          COMMAND_PRIORITY_EDITOR
        );
      });
    },
  }),
  {
    commands: () => ({
      toggleItalic: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_TOGGLE_ITALIC, undefined),
    }),
    shortcuts: [{ key: "i", modifiers: ["mod"], command: "toggleItalic" }],
  }
);

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    toggleItalic(): R;
  }
}
