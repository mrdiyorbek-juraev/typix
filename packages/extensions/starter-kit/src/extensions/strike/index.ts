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

export interface StrikeConfig {
  disabled?: boolean;
}

export const TYPIX_TOGGLE_STRIKE = createCommand<void>("TYPIX_TOGGLE_STRIKE");

export const StrikeExtension = withTypixMeta(
  defineExtension({
    name: "@typix/strike",
    config: safeCast<StrikeConfig>({ disabled: false }),
    mergeConfig(a: StrikeConfig, b: Partial<StrikeConfig>): StrikeConfig {
      return { ...a, ...b };
    },
    build(_editor: LexicalEditor, config: StrikeConfig) {
      return namedSignals(config);
    },
    register(editor: LexicalEditor, _config: StrikeConfig, state: any) {
      const { disabled } = state.getOutput();
      return effect(() => {
        if (disabled?.value) return;
        return editor.registerCommand(
          TYPIX_TOGGLE_STRIKE,
          () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            return true;
          },
          COMMAND_PRIORITY_EDITOR
        );
      });
    },
  }),
  {
    commands: () => ({
      toggleStrike: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_TOGGLE_STRIKE, undefined),
    }),
    shortcuts: [
      { key: "s", modifiers: ["mod", "shift"], command: "toggleStrike" },
    ],
  }
);

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    toggleStrike(): R;
  }
}
