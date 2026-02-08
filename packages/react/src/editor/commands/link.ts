import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import type { LexicalEditor } from "lexical";

export function toggleLink(editor: LexicalEditor, url: string): void {
  editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
}
