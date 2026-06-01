import {
  defineExtension,
  safeCast,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
} from "lexical";
import {
  $toggleLink,
  LinkNode,
  AutoLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@typix-editor/core/lexical/link";
import { registerTypixMeta } from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface LinkConfig {
  /** Whether to register AutoLinkNode for URL auto-detection */
  autoLink: boolean;
  /** Default target attribute, e.g. '_blank'. null = no target attr */
  defaultTarget: string | null;
  disabled?: boolean;
}

export const TYPIX_SET_LINK = createCommand<{
  url: string;
  target?: string | null;
}>("TYPIX_SET_LINK");
export const TYPIX_UNSET_LINK = createCommand<void>("TYPIX_UNSET_LINK");

export const LinkExtension = defineExtension({
  name: "@typix/link",
  config: safeCast<LinkConfig>({
    autoLink: false,
    defaultTarget: null,
    disabled: false,
  }),
  mergeConfig(a: LinkConfig, b: Partial<LinkConfig>): LinkConfig {
    return { ...a, ...b };
  },
  nodes: () => [LinkNode, AutoLinkNode],
  build(_editor: LexicalEditor, config: LinkConfig) {
    return namedSignals(config);
  },
  register(editor: LexicalEditor, _config: LinkConfig, state) {
    const { disabled, defaultTarget } = state.getOutput();

    return effect(() => {
      if (disabled?.value) return;

      const d0 = editor.registerCommand(
        TOGGLE_LINK_COMMAND,
        (payload) => {
          const currentTarget = defaultTarget?.value ?? null;
          if (payload === null) {
            $toggleLink(null);
            return true;
          }
          if (payload === undefined) return false;
          if (typeof payload === "string") {
            $toggleLink(payload, { target: currentTarget ?? undefined });
            return true;
          }
          const { url, ...attrs } = payload as {
            url: string;
            target?: string | null;
          };
          if (!url) return false;
          $toggleLink(url, {
            target: attrs.target ?? currentTarget ?? undefined,
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );
      const d1 = editor.registerCommand(
        TYPIX_SET_LINK,
        (payload) => {
          if (!payload) return false;
          const { url, target } = payload;
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
            url,
            target: target ?? defaultTarget?.value ?? null,
          });
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
  shortcuts: [{ key: "k", modifiers: ["mod"], command: "setLink" }],
});

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    setLink(attrs: {
      url: string;
      target?: string | null;
      rel?: string | null;
      title?: string | null;
    }): R;
    unsetLink(): R;
  }
}
