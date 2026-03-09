import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
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

let lastTabKeyDownTimestamp = 0;
let hasRegisteredKeyDownListener = false;

function registerKeyTimestampTracker(): void {
  if (typeof window === "undefined") return;
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
  /**
   * Time window in milliseconds after a Tab key press during which a FOCUS
   * event is treated as keyboard-tab navigation (restoring the selection).
   * @default 100
   */
  restoreWindowMs?: number;
}

export const TabFocusExtension = (userConfig: Partial<TabFocusConfig> = {}) => {
  const resolvedConfig: TabFocusConfig = {
    disabled: false,
    restoreWindowMs: 100,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/tab-focus",

    config: safeCast<TabFocusConfig>(resolvedConfig),

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
                lastTabKeyDownTimestamp +
                  (resolvedConfig.restoreWindowMs ?? 100) >
                  event.timeStamp
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

  return lexicalExt;
};
