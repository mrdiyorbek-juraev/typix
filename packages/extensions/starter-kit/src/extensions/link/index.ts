import {
  defineExtension,
  safeCast,
  COMMAND_PRIORITY_EDITOR,
  type LexicalEditor,
} from "lexical";
import {
  $toggleLink,
  LinkNode,
  AutoLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@typix-editor/core/lexical/link";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface LinkConfig extends TypixExtensionConfig {
  /** Whether to register AutoLinkNode for URL auto-detection */
  autoLink: boolean;
  /** Default target attribute, e.g. '_blank'. null = no target attr */
  defaultTarget: string | null;
  disabled?: boolean;
}

/**
 * LinkExtension — creates, updates, and removes hyperlinks.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [LinkExtension({ defaultTarget: '_blank' })] })
 *
 * editor.chain().setLink({ url: 'https://example.com' }).run()
 * editor.chain().unsetLink().run()
 * ```
 */
export const LinkExtension = (userConfig: Partial<LinkConfig> = {}) => {
  const resolvedConfig: LinkConfig = {
    autoLink: false,
    defaultTarget: null,
    ...userConfig,
  };
  const lexicalExt = defineExtension({
    name: "@typix/link",
    config: safeCast<LinkConfig>(resolvedConfig),
    mergeConfig(a: LinkConfig, b: Partial<LinkConfig>): LinkConfig {
      return { ...a, ...b };
    },
    nodes: () =>
      resolvedConfig.autoLink ? [LinkNode, AutoLinkNode] : [LinkNode],
    build(_editor: LexicalEditor, config: LinkConfig) {
      return namedSignals(config);
    },
    register(editor: LexicalEditor, _config: LinkConfig, state) {
      const { disabled, defaultTarget } = state.getOutput();

      return effect(() => {
        if (disabled?.value) return;

        return editor.registerCommand(
          TOGGLE_LINK_COMMAND,
          (payload) => {
            const currentTarget = defaultTarget?.value ?? null;

            if (payload === null) {
              $toggleLink(null);
              return true;
            }
            if (typeof payload === "string") {
              $toggleLink(payload, { target: currentTarget ?? undefined });
              return true;
            }
            const { url, ...attrs } = payload as {
              url: string;
              target?: string | null;
            };
            $toggleLink(url, {
              target: attrs.target ?? currentTarget ?? undefined,
            });
            return true;
          },
          COMMAND_PRIORITY_EDITOR
        );
      });
    },
  });

  return defineTypixExtension<LinkConfig>({
    name: "link",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      setLink: (resolvedConfig) => (ctx, attrs) => {
        if (resolvedConfig.disabled) return false;
        const url = attrs?.url as string | undefined;
        if (!url) {
          console.warn(
            '[Typix] setLink requires a url attr, e.g. { url: "https://example.com" }'
          );
          return false;
        }
        const target =
          (attrs?.target as string | null) ?? resolvedConfig.defaultTarget;
        ctx.editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url, target });
        return true;
      },

      unsetLink: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        return true;
      },
    },
    shortcuts: [{ key: "k", modifiers: ["mod"], command: "setLink" }],
  });
};
