import {
  defineExtension,
  safeCast,
  FORMAT_ELEMENT_COMMAND,
  type LexicalEditor,
  type ElementFormatType,
} from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
import { namedSignals } from "@typix-editor/core/lexical/extension";

export type AlignmentValue =
  | "left"
  | "center"
  | "right"
  | "justify"
  | "start"
  | "end";

export interface AlignmentConfig extends TypixExtensionConfig {
  /** Which alignments to allow. Defaults to all. */
  alignments: AlignmentValue[];
  disabled?: boolean;
}

/**
 * AlignmentExtension — aligns selected block elements.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [AlignmentExtension()] })
 *
 * editor.chain().setAlignment({ alignment: 'center' }).run()
 * editor.chain().alignLeft().run()
 * ```
 */
export const AlignmentExtension = (
  userConfig: Partial<AlignmentConfig> = {}
) => {
  const resolvedConfig: AlignmentConfig = {
    alignments: ["left", "center", "right", "justify", "start", "end"],
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/alignment",
    config: safeCast<AlignmentConfig>(resolvedConfig),
    mergeConfig(
      a: AlignmentConfig,
      b: Partial<AlignmentConfig>
    ): AlignmentConfig {
      return { ...a, ...b };
    },
    build(_editor: LexicalEditor, config: AlignmentConfig) {
      return namedSignals(config);
    },
  });

  return defineTypixExtension<AlignmentConfig>({
    name: "alignment",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      /** Generic — pass `{ alignment: 'center' }` as attrs */
      setAlignment: (resolvedConfig) => (ctx, attrs) => {
        if (resolvedConfig.disabled) return false;
        const alignment = (attrs as any)?.alignment as
          | AlignmentValue
          | undefined;
        if (!alignment) {
          console.warn(
            '[Typix] setAlignment requires an alignment attr, e.g. { alignment: "center" }'
          );
          return false;
        }
        if (!resolvedConfig.alignments.includes(alignment)) {
          console.warn(`[Typix] Alignment "${alignment}" is not enabled.`);
          return false;
        }
        ctx.editor.dispatchCommand(
          FORMAT_ELEMENT_COMMAND,
          alignment as ElementFormatType
        );
        return true;
      },

      alignLeft: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        return true;
      },

      alignCenter: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        return true;
      },

      alignRight: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        return true;
      },

      alignJustify: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        return true;
      },

      alignStart: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "start");
        return true;
      },

      alignEnd: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "end");
        return true;
      },
    },
    shortcuts: [
      { key: "l", modifiers: ["mod", "shift"], command: "alignLeft" },
      { key: "e", modifiers: ["mod", "shift"], command: "alignCenter" },
      { key: "r", modifiers: ["mod", "shift"], command: "alignRight" },
      { key: "j", modifiers: ["mod", "shift"], command: "alignJustify" },
    ],
  });
};
