"use client";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { History } from "./history-context";
import { ShortcutsPlugin } from "./shortcuts-plugin";

/**
 * Only mounts ListPlugin when ListNode is registered on the editor.
 * Prevents crashes when presets that disable the list extension are used.
 */
function SafeListPlugin() {
  const [editor] = useLexicalComposerContext();
  const hasListNodes =
    editor._nodes.has("list") && editor._nodes.has("listitem");
  if (!hasListNodes) return null;
  return <ListPlugin />;
}

/**
 * The opinionated default plugin set rendered inside EditorContent.
 * Includes history, autofocus, keyboard shortcut binding, and a safe
 * list plugin. Pass `plugins={...}` to EditorContent to replace this
 * with a custom plugin tree.
 */
export function DefaultPlugins() {
  return (
    <>
      <History />
      <AutoFocusPlugin />
      <ShortcutsPlugin />
      <SafeListPlugin />
    </>
  );
}
