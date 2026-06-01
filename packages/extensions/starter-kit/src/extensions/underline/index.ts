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

export interface UnderlineConfig {
  disabled?: boolean;
}

export const TYPIX_TOGGLE_UNDERLINE = createCommand<void>(
  "TYPIX_TOGGLE_UNDERLINE"
);

export const UnderlineExtension = defineExtension({
  name: "@typix/underline",
  config: safeCast<UnderlineConfig>({ disabled: false }),
  mergeConfig(
    a: UnderlineConfig,
    b: Partial<UnderlineConfig>
  ): UnderlineConfig {
    return { ...a, ...b };
  },
  build(_editor: LexicalEditor, config: UnderlineConfig) {
    return namedSignals(config);
  },
  register(editor: LexicalEditor, _config: UnderlineConfig, state: any) {
    const { disabled } = state.getOutput();
    return effect(() => {
      if (disabled?.value) return;
      return editor.registerCommand(
        TYPIX_TOGGLE_UNDERLINE,
        () => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );
    });
  },
});

registerTypixMeta(UnderlineExtension, {
  commands: { toggleUnderline: TYPIX_TOGGLE_UNDERLINE },
  shortcuts: [{ key: "u", modifiers: ["mod"], command: "toggleUnderline" }],
});

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    toggleUnderline(): R;
  }
}
