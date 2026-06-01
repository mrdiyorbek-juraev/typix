import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import {
  $toggleLink,
  type LinkAttributes,
  LinkNode,
  TOGGLE_LINK_COMMAND,
} from "@typix-editor/core/lexical/link";
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  defineExtension,
  safeCast,
} from "lexical";
import { registerTypixMeta } from "@typix-editor/core";

export interface LinkConfig {
  /** Set to true to temporarily disable link toggle handling. */
  disabled: boolean;
  validateUrl?: ((url: string) => boolean) | undefined;
  attributes?: LinkAttributes | undefined;
}

export const TYPIX_SET_LINK = createCommand<{ url: string } & LinkAttributes>(
  "TYPIX_SET_LINK"
);
export const TYPIX_UNSET_LINK = createCommand<void>("TYPIX_UNSET_LINK");

export const LinkExtension = defineExtension({
  name: "@typix/link",

  nodes: () => [LinkNode],

  config: safeCast<LinkConfig>({ disabled: false }),

  mergeConfig(a: LinkConfig, b: Partial<LinkConfig>): LinkConfig {
    return { ...a, ...b };
  },

  build(_editor, config) {
    return namedSignals(config);
  },

  register(editor, config, state) {
    const { disabled, validateUrl, attributes } = state.getOutput();

    return effect(() => {
      if (disabled.value) return;

      const d0 = editor.registerCommand(
        TOGGLE_LINK_COMMAND,
        (payload) => {
          const currentValidateUrl = validateUrl?.value;
          const defaultAttributes = attributes?.value;

          if (payload === null) {
            $toggleLink(null);
            return true;
          }
          if (payload === undefined) return false;
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
          if (!url) return false;
          if (currentValidateUrl === undefined || currentValidateUrl(url)) {
            $toggleLink(url, { ...defaultAttributes, ...payloadAttrs });
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_EDITOR
      );

      const d1 = editor.registerCommand(
        TYPIX_SET_LINK,
        (payload) => {
          if (!payload) return false;
          const { url, ...attrs } = payload;
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url, ...attrs });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      const d2 = editor.registerCommand(
        TYPIX_UNSET_LINK,
        () => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      return () => {
        d0();
        d1();
        d2();
      };
    });
  },
});

registerTypixMeta(LinkExtension, {
  commands: {
    setLink: TYPIX_SET_LINK,
    unsetLink: TYPIX_UNSET_LINK,
  },
});
