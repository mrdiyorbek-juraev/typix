"use client";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ShortcutsPlugin } from "./shortcuts-plugin";

interface DefaultPluginsProps {
  /**
   * If set, mounts `<AutoFocusPlugin>` with the matching defaultSelection.
   * `false` (default) skips autofocus entirely.
   */
  autoFocus?: "start" | "end" | false;
}

/**
 * Opinionated default plugin set rendered by EditorContent.
 *
 * History and list behavior is intentionally **not** mounted here —
 * `HistoryExtension` and `ListExtension` (from StarterKit or imported
 * individually) already call `registerHistory` / `registerList` on the
 * editor. Mounting `HistoryPlugin` / `ListPlugin` on top of them
 * duplicates the update listeners and causes Lexical's
 * `$triggerEnqueuedUpdates` to throw "endlessly enqueueing more updates".
 *
 * If you need history/list behavior without StarterKit, add
 * `HistoryExtension` / `ListExtension` to your extensions array — don't
 * mount the React plugins manually.
 */
export function DefaultPlugins({ autoFocus = false }: DefaultPluginsProps) {
  return (
    <>
      {autoFocus !== false ? (
        <AutoFocusPlugin
          defaultSelection={autoFocus === "start" ? "rootStart" : "rootEnd"}
        />
      ) : null}
      <ShortcutsPlugin />
    </>
  );
}

export type { DefaultPluginsProps };
