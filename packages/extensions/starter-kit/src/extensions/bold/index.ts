import {
  defineExtension,
  safeCast,
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
} from "lexical";
import { registerTypixMeta } from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface BoldConfig {
  disabled?: boolean;
}

export const TYPIX_TOGGLE_BOLD = createCommand<void>("TYPIX_TOGGLE_BOLD");

export const BoldExtension = defineExtension({
  name: "@typix/bold",
  config: safeCast<BoldConfig>({ disabled: false }),
  mergeConfig(a: BoldConfig, b: Partial<BoldConfig>): BoldConfig {
    return { ...a, ...b };
  },
  build(_editor: LexicalEditor, config: BoldConfig) {
    return namedSignals(config);
  },
  register(editor: LexicalEditor, _config: BoldConfig, state: any) {
    const { disabled } = state.getOutput();
    return effect(() => {
      if (disabled?.value) return;
      return editor.registerCommand(
        TYPIX_TOGGLE_BOLD,
        () => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );
    });
  },
});

registerTypixMeta(BoldExtension, {
  commands: { toggleBold: TYPIX_TOGGLE_BOLD },
  shortcuts: [{ key: "b", modifiers: ["mod"], command: "toggleBold" }],
});
