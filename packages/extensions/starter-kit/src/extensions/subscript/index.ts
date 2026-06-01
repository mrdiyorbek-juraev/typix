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

export interface SubscriptConfig {
  disabled?: boolean;
}

export const TYPIX_TOGGLE_SUBSCRIPT = createCommand<void>(
  "TYPIX_TOGGLE_SUBSCRIPT"
);

export const SubscriptExtension = defineExtension({
  name: "@typix/subscript",
  config: safeCast<SubscriptConfig>({ disabled: false }),
  mergeConfig(
    a: SubscriptConfig,
    b: Partial<SubscriptConfig>
  ): SubscriptConfig {
    return { ...a, ...b };
  },
  build(_editor: LexicalEditor, config: SubscriptConfig) {
    return namedSignals(config);
  },
  register(editor: LexicalEditor, _config: SubscriptConfig, state: any) {
    const { disabled } = state.getOutput();
    return effect(() => {
      if (disabled?.value) return;
      return editor.registerCommand(
        TYPIX_TOGGLE_SUBSCRIPT,
        () => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );
    });
  },
});

registerTypixMeta(SubscriptExtension, {
  commands: { toggleSubscript: TYPIX_TOGGLE_SUBSCRIPT },
});


declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    toggleSubscript(): R;
  }
}
