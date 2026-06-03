import { defineExtension, safeCast } from "lexical";

export interface DraggableBlockConfig {
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

  return lexicalExt;
};
