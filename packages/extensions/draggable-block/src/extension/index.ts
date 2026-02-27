import { defineExtension, safeCast } from "lexical";

export interface DraggableBlockConfig {
  disabled: boolean;
}

export const DraggableBlockExtension = defineExtension({
  name: "@typix/draggable-block",
  config: safeCast<DraggableBlockConfig>({ disabled: false }),
});
