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

export interface SuperscriptConfig {
  disabled?: boolean;
}

export const TYPIX_TOGGLE_SUPERSCRIPT = createCommand<void>(
  "TYPIX_TOGGLE_SUPERSCRIPT"
);

export const SuperscriptExtension = defineExtension({
  name: "@typix/superscript",
  config: safeCast<SuperscriptConfig>({ disabled: false }),
  mergeConfig(
    a: SuperscriptConfig,
    b: Partial<SuperscriptConfig>
  ): SuperscriptConfig {
    return { ...a, ...b };
  },
  build(_editor: LexicalEditor, config: SuperscriptConfig) {
    return namedSignals(config);
  },
  register(editor: LexicalEditor, _config: SuperscriptConfig, state: any) {
    const { disabled } = state.getOutput();
    return effect(() => {
      if (disabled?.value) return;
      return editor.registerCommand(
        TYPIX_TOGGLE_SUPERSCRIPT,
        () => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );
    });
  },
});

registerTypixMeta(SuperscriptExtension, {
  commands: { toggleSuperscript: TYPIX_TOGGLE_SUPERSCRIPT },
});

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    toggleSuperscript(): R;
  }
}
