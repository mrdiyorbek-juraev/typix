import { effect, namedSignals } from "@lexical/extension";
import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  defineExtension,
  FOCUS_COMMAND,
  mergeRegister,
  safeCast,
} from "lexical";

const TAB_TO_FOCUS_INTERVAL = 100;

let lastTabKeyDownTimestamp = 0;
let hasRegisteredKeyDownListener = false;

function registerKeyTimestampTracker(): void {
  const handler = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      lastTabKeyDownTimestamp = event.timeStamp;
    }
  };
  window.addEventListener("keydown", handler, true);
}

export interface TabFocusConfig {
  /** Set to true to temporarily disable tab-focus behavior. */
  disabled: boolean;
}

export const TabFocusExtension = defineExtension({
  name: "@typix/tab-focus",

  config: safeCast<TabFocusConfig>({ disabled: false }),

  build(_editor, config) {
    return namedSignals(config);
  },

  register(editor, _config, state) {
    const { disabled } = state.getOutput();

    return effect(() => {
      if (disabled.value) return;

      if (!hasRegisteredKeyDownListener) {
        // The global tracker is intentionally shared across editor instances
        // so that any Tab key press is captured regardless of which editor is focused.
        registerKeyTimestampTracker();
        hasRegisteredKeyDownListener = true;
      }

      return mergeRegister(
        editor.registerCommand(
          FOCUS_COMMAND,
          (event: FocusEvent) => {
            const selection = $getSelection();
            if (
              $isRangeSelection(selection) &&
              lastTabKeyDownTimestamp + TAB_TO_FOCUS_INTERVAL > event.timeStamp
            ) {
              $setSelection(selection.clone());
            }
            return false;
          },
          COMMAND_PRIORITY_LOW
        )
      );
    });
  },
});
