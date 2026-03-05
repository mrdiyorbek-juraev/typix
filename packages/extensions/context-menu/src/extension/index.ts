import { defineExtension, safeCast } from "lexical";
import { defineTypixExtension, type TypixExtensionConfig } from "@typix-editor/core";

export interface ContextMenuConfig extends TypixExtensionConfig {
  disabled: boolean;
}

export const ContextMenuExtension = (userConfig: Partial<ContextMenuConfig> = {}) => {
  const resolvedConfig: ContextMenuConfig = {
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/context-menu",
    config: safeCast<ContextMenuConfig>(resolvedConfig),
  });

  return defineTypixExtension({
    name: "context-menu",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
