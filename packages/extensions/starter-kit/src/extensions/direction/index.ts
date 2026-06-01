import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  defineExtension,
  safeCast,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
} from "lexical";
import {
  namedSignals,
  signal,
  type Signal,
} from "@typix-editor/core/lexical/extension";
import { registerTypixMeta } from "@typix-editor/core";

/** Text direction value. `null` removes explicit direction (browser default / auto-detect). */
export type DirectionValue = "ltr" | "rtl" | "auto" | null;

export interface DirectionConfig {
  /** Initial global direction applied to the editor root element. Default: null (browser default). */
  defaultGlobalDirection: DirectionValue;
  disabled?: boolean;
}

/** Reactive state exposed by DirectionExtension. Read via `getDirectionState(editor)`. */
export interface DirectionState {
  /** Current global direction applied to the editor root element. */
  globalDirection: Signal<DirectionValue>;
}

const _stateByEditor = new WeakMap<LexicalEditor, DirectionState>();

/** Get the reactive state for the DirectionExtension registered on this editor. */
export function getDirectionState(
  editor: LexicalEditor
): DirectionState | undefined {
  return _stateByEditor.get(editor);
}

export const TYPIX_SET_GLOBAL_DIRECTION = createCommand<{
  direction: DirectionValue;
}>("TYPIX_SET_GLOBAL_DIRECTION");
export const TYPIX_SET_LTR = createCommand<void>("TYPIX_SET_LTR");
export const TYPIX_SET_RTL = createCommand<void>("TYPIX_SET_RTL");
export const TYPIX_SET_AUTO_DIRECTION = createCommand<void>(
  "TYPIX_SET_AUTO_DIRECTION"
);
export const TYPIX_UNSET_DIRECTION = createCommand<void>(
  "TYPIX_UNSET_DIRECTION"
);

export const DirectionExtension = defineExtension({
  name: "@typix/direction",
  config: safeCast<DirectionConfig>({
    defaultGlobalDirection: null,
    disabled: false,
  }),
  mergeConfig(
    a: DirectionConfig,
    b: Partial<DirectionConfig>
  ): DirectionConfig {
    return { ...a, ...b };
  },
  build(editor: LexicalEditor, config: DirectionConfig) {
    const globalDirection = signal<DirectionValue>(
      config.defaultGlobalDirection
    );
    _stateByEditor.set(editor, { globalDirection });
    return { ...namedSignals(config), globalDirection };
  },
  register(editor: LexicalEditor, _config: DirectionConfig, state) {
    const { disabled, globalDirection } = state.getOutput();

    const applyGlobalDir = () => {
      if (disabled?.value) return;
      const dir = globalDirection.value;
      const rootEl = editor.getRootElement();
      if (!rootEl) return;
      if (dir === null) {
        rootEl.removeAttribute("dir");
      } else {
        rootEl.setAttribute("dir", dir);
      }
    };

    const cleanups: Array<() => void> = [
      globalDirection.subscribe(() => applyGlobalDir()),
      editor.registerRootListener((rootEl) => {
        if (rootEl) applyGlobalDir();
      }),
      editor.registerCommand(
        TYPIX_SET_GLOBAL_DIRECTION,
        ({ direction }) => {
          if (disabled?.value) return false;
          globalDirection.value = direction;
          editor.update(() => {
            $getRoot().setDirection(
              direction === "ltr" || direction === "rtl" ? direction : null
            );
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        TYPIX_SET_LTR,
        () => {
          if (disabled?.value) return false;
          editor.update(() => $applyDirectionToSelection("ltr"));
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        TYPIX_SET_RTL,
        () => {
          if (disabled?.value) return false;
          editor.update(() => $applyDirectionToSelection("rtl"));
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        TYPIX_SET_AUTO_DIRECTION,
        () => {
          if (disabled?.value) return false;
          editor.update(() => $applyDirectionToSelection(null));
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        TYPIX_UNSET_DIRECTION,
        () => {
          if (disabled?.value) return false;
          editor.update(() => $applyDirectionToSelection(null));
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
    ];

    return () => cleanups.forEach((fn) => fn());
  },
});

registerTypixMeta(DirectionExtension, {
  commands: {
    setGlobalDirection: TYPIX_SET_GLOBAL_DIRECTION,
    setLTR: TYPIX_SET_LTR,
    setRTL: TYPIX_SET_RTL,
    setAutoDirection: TYPIX_SET_AUTO_DIRECTION,
    unsetDirection: TYPIX_UNSET_DIRECTION,
  },
});

/** @internal Apply direction to all top-level block nodes in the current selection. */
function $applyDirectionToSelection(direction: "ltr" | "rtl" | null): void {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return;

  const seen = new Set<string>();
  for (const node of selection.getNodes()) {
    const topLevel = node.getTopLevelElementOrThrow();
    const key = topLevel.getKey();
    if (!seen.has(key) && $isElementNode(topLevel)) {
      seen.add(key);
      topLevel.setDirection(direction);
    }
  }
}

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    setGlobalDirection(attrs: { direction: "ltr" | "rtl" | "auto" | null }): R;
    setLTR(): R;
    setRTL(): R;
    setAutoDirection(): R;
    unsetDirection(): R;
  }
}
