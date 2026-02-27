import { defineExtension, safeCast } from "lexical";

export interface ContextMenuConfig {
  disabled: boolean;
}

export const ContextMenuExtension = defineExtension({
  name: "@typix/context-menu",
  config: safeCast<ContextMenuConfig>({ disabled: false }),
});
