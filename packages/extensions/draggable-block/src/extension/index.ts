import { defineExtension, safeCast } from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

export interface DraggableBlockConfig extends TypixExtensionConfig {
  disabled: boolean;
}

export const DraggableBlockExtension = (
  userConfig: Partial<DraggableBlockConfig> = {}
) => {
  const resolvedConfig: DraggableBlockConfig = {
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/draggable-block",
    config: safeCast<DraggableBlockConfig>(resolvedConfig),
  });

  return defineTypixExtension({
    name: "draggable-block",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
