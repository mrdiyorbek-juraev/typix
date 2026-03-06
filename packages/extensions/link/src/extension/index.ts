import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import {
  $toggleLink,
  type LinkAttributes,
  LinkNode,
  TOGGLE_LINK_COMMAND,
} from "@typix-editor/core/lexical/link";
import { COMMAND_PRIORITY_EDITOR, defineExtension, safeCast } from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

export interface LinkConfig extends TypixExtensionConfig {
  /** Set to true to temporarily disable link toggle handling. */
  disabled: boolean;
  validateUrl?: ((url: string) => boolean) | undefined;
  attributes?: LinkAttributes | undefined;
}

export const LinkExtension = (userConfig: Partial<LinkConfig> = {}) => {
  const resolvedConfig: LinkConfig = {
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/link",

    nodes: () => [LinkNode],

    config: safeCast<LinkConfig>(resolvedConfig),

    build(_editor, config) {
      return namedSignals(config);
    },

    register(editor, _config, state) {
      const { disabled, validateUrl, attributes } = state.getOutput();

      return effect(() => {
        if (disabled.value) return;

        return editor.registerCommand(
          TOGGLE_LINK_COMMAND,
          (payload) => {
            // Read config signals inside handler so they're always current
            // without creating subscriptions in the effect.
            const currentValidateUrl = validateUrl?.value;
            const defaultAttributes = attributes?.value;

            if (payload === null) {
              $toggleLink(null);
              return true;
            }
            if (typeof payload === "string") {
              if (
                currentValidateUrl === undefined ||
                currentValidateUrl(payload)
              ) {
                $toggleLink(payload, defaultAttributes);
                return true;
              }
              return false;
            }
            const { url, ...payloadAttrs } = payload;
            if (currentValidateUrl === undefined || currentValidateUrl(url)) {
              $toggleLink(url, { ...defaultAttributes, ...payloadAttrs });
              return true;
            }
            return false;
          },
          COMMAND_PRIORITY_EDITOR
        );
      });
    },
  });

  return defineTypixExtension({
    name: "link",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      setLink: () => (ctx, attrs) => {
        const url = (attrs as Record<string, unknown>)?.url as
          | string
          | undefined;
        if (!url) return false;
        ctx.editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        return true;
      },
      unsetLink: () => (ctx) => {
        ctx.editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        return true;
      },
    },
  });
};
