import { StarterKit } from "@typix-editor/extension-starter-kit";
import { CodeBlockExtension } from "@typix-editor/extension-code-block";
import { PrettierFormatterExtension } from "@typix-editor/extension-code-block-prettier";
import { AutocompleteExtension } from "@typix-editor/extension-auto-complete";
import { KeywordsExtension } from "@typix-editor/extension-keywords";
import { SpeechToTextExtension } from "@typix-editor/extension-speech-to-text";
import { CollapsibleExtension } from "@typix-editor/extension-collapsible";
import { TabFocusExtension } from "@typix-editor/extension-tab-focus";
import { CodeHighlightPrismExtension } from "@typix-editor/extension-code-highlight-prism";
import { MarkdownShortcutsExtension } from "@typix-editor/extension-markdown-shortcuts";
import { TableExtension } from "@typix-editor/extension-table";
import { ImageExtension } from "@typix-editor/extension-image";
import { ContextMenuExtension } from "@typix-editor/extension-context-menu";
import { FloatingLinkExtension } from "@typix-editor/extension-floating-link";

// import { TailwindExtension } from "@typix-editor/extension-tailwind"; //TODO: enable when needed
import { imageRenderer } from "@typix-editor/ui";
import { MentionExtension } from "@typix-editor/extension-mention";

/**
 * All extensions for the playground editor.
 * Defined at module level — stable reference, never re-created on render.
 */
export const editorExtensions = [
  StarterKit(),
  // TailwindExtension(), // TODO: Enable when needed
  CodeBlockExtension({ defaultLanguage: "javascript" }),
  ContextMenuExtension(),
  AutocompleteExtension(),
  KeywordsExtension(),
  FloatingLinkExtension(),
  SpeechToTextExtension(),
  CollapsibleExtension(),
  TabFocusExtension(),
  MentionExtension(),
  CodeHighlightPrismExtension(),
  MarkdownShortcutsExtension(),
  TableExtension(),
  ImageExtension({ component: imageRenderer }),
  PrettierFormatterExtension({
    printOptions: { tabWidth: 2, singleQuote: true },
  }),
];
