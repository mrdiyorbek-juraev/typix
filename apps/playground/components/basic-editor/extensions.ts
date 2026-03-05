import { StarterKit } from "@typix-editor/starter-kit";
import { AutocompleteExtension } from "@typix-editor/extension-auto-complete";
import { KeywordsExtension } from "@typix-editor/extension-keywords";
import { SpeechToTextExtension } from "@typix-editor/extension-speech-to-text";
import { CollapsibleExtension } from "@typix-editor/extension-collapsible";
import { TabFocusExtension } from "@typix-editor/extension-tab-focus";
import { CodeHighlightPrismExtension } from "@typix-editor/extension-code-highlight-prism";

/**
 * All extensions for the playground editor.
 * Defined at module level — stable reference, never re-created on render.
 */
export const editorExtensions = [
  StarterKit(),
  AutocompleteExtension(),
  KeywordsExtension(),
  SpeechToTextExtension(),
  CollapsibleExtension(),
  TabFocusExtension(),
  CodeHighlightPrismExtension(),
];
