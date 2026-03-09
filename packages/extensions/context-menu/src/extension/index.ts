import { defineExtension, safeCast } from "lexical";

export interface ContextMenuConfig {
  disabled: boolean;
}

export const ContextMenuExtension = (
  userConfig: Partial<ContextMenuConfig> = {}
) => {
  const resolvedConfig: ContextMenuConfig = {
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/context-menu",
    config: safeCast<ContextMenuConfig>(resolvedConfig),
  });

  return lexicalExt;
};
