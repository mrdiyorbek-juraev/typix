import { effect, namedSignals } from "@lexical/extension";
import {
  $toggleLink,
  type LinkAttributes,
  LinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import {
  COMMAND_PRIORITY_EDITOR,
  defineExtension,
  safeCast,
} from "lexical";

export interface LinkConfig {
  /** Set to true to temporarily disable link toggle handling. */
  disabled: boolean;
  validateUrl?: ((url: string) => boolean) | undefined;
  attributes?: LinkAttributes | undefined;
}

export const LinkExtension = defineExtension({
  name: "@typix/link",

  nodes: () => [LinkNode],

  config: safeCast<LinkConfig>({ disabled: false }),

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
            if (currentValidateUrl === undefined || currentValidateUrl(payload)) {
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
