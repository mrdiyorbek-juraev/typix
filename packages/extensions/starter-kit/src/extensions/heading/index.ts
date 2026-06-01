import {
  defineExtension,
  safeCast,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalEditor,
} from "lexical";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingNode,
  type HeadingTagType,
} from "@typix-editor/core/lexical/rich-text";
import { $setBlocksType } from "@typix-editor/core/lexical/selection";
import { registerTypixMeta } from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface HeadingConfig {
  levels: Array<1 | 2 | 3 | 4 | 5 | 6>;
  disabled?: boolean;
}

export const TYPIX_TOGGLE_HEADING = createCommand<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
}>("TYPIX_TOGGLE_HEADING");

export const TYPIX_SET_HEADING = createCommand<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
}>("TYPIX_SET_HEADING");

export const HeadingExtension = defineExtension({
  name: "@typix/heading",
  config: safeCast<HeadingConfig>({
    levels: [1, 2, 3, 4, 5, 6],
    disabled: false,
  }),
  mergeConfig(a: HeadingConfig, b: Partial<HeadingConfig>): HeadingConfig {
    return { ...a, ...b };
  },
  nodes: () => [HeadingNode],
  build(_editor: LexicalEditor, config: HeadingConfig) {
    return namedSignals(config);
  },
  register(editor: LexicalEditor, _config: HeadingConfig, state: any) {
    const { disabled, levels } = state.getOutput();
    return effect(() => {
      if (disabled?.value) return;
      const d1 = editor.registerCommand(
        TYPIX_TOGGLE_HEADING,
        ({ level }) => {
          const enabledLevels: Array<1 | 2 | 3 | 4 | 5 | 6> = levels?.value ?? [
            1, 2, 3, 4, 5, 6,
          ];
          if (!enabledLevels.includes(level)) {
            console.warn(
              `[Typix] Heading level ${level} is not enabled. Enabled: ${enabledLevels}`
            );
            return false;
          }
          const tag = `h${level}` as HeadingTagType;
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            const anchor = selection.anchor.getNode();
            const parent = anchor.getParent();
            const isAlready = $isHeadingNode(parent) && parent.getTag() === tag;
            $setBlocksType(selection, () =>
              isAlready ? $createParagraphNode() : $createHeadingNode(tag)
            );
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );
      const d2 = editor.registerCommand(
        TYPIX_SET_HEADING,
        ({ level }) => {
          const tag = `h${level}` as HeadingTagType;
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            $setBlocksType(selection, () => $createHeadingNode(tag));
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

registerTypixMeta(HeadingExtension, {
  commands: {
    toggleHeading: TYPIX_TOGGLE_HEADING,
    setHeading: TYPIX_SET_HEADING,
  },
  shortcuts: [
    {
      key: "1",
      modifiers: ["mod", "alt"],
      command: "toggleHeading",
      args: { level: 1 },
    },
    {
      key: "2",
      modifiers: ["mod", "alt"],
      command: "toggleHeading",
      args: { level: 2 },
    },
    {
      key: "3",
      modifiers: ["mod", "alt"],
      command: "toggleHeading",
      args: { level: 3 },
    },
  ],
});

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    toggleHeading(attrs: { level: 1 | 2 | 3 | 4 | 5 | 6 }): R;
    setHeading(attrs: { level: 1 | 2 | 3 | 4 | 5 | 6 }): R;
  }
}
