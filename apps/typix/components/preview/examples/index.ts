import { lazy } from "react";
import { files as uiMarkButtonFiles } from "./ui/mark-button";
import { files as uiHeadingButtonFiles } from "./ui/heading-button";
import { files as uiBlockButtonsFiles } from "./ui/block-buttons";
import { files as uiListDropdownFiles } from "./ui/list-dropdown";
import { files as uiTextAlignFiles } from "./ui/text-align";
import { files as uiUndoRedoFiles } from "./ui/undo-redo";
import { files as uiClearFormattingFiles } from "./ui/clear-formatting";
import { files as uiColorTextFiles } from "./ui/color-text";
import { files as uiColorHighlightFiles } from "./ui/color-highlight";
import { files as uiFontSizeFiles } from "./ui/font-size";
import { files as uiFontFamilyFiles } from "./ui/font-family";
import { files as quickExampleFiles } from "./quick-example";
import { files as autoCompleteFiles } from "./auto-complete";
import { files as autoLinkFiles } from "./auto-link";
import { files as codeBlockFiles } from "./code-block";
import { files as codeBlockPrettierFiles } from "./code-block-prettier";
import { files as codeHighlightPrismFiles } from "./code-highlight-prism";
import { files as codeHighlightShikiFiles } from "./code-highlight-shiki";
import { files as collapsibleFiles } from "./collapsible";
import { files as contextMenuFiles } from "./context-menu";
import { files as dragDropPasteFiles } from "./drag-drop-paste";
import { files as draggableBlockFiles } from "./draggable-block";
import { files as floatingLinkFiles } from "./floating-link";
import { files as imageFiles } from "./image";
import { files as keywordsFiles } from "./keywords";
import { files as linkFiles } from "./link";
import { files as markdownShortcutsFiles } from "./markdown-shortcuts";
import { files as characterLimitFiles } from "./character-limit";
import { files as maxLengthFiles } from "./max-length";
import { files as mentionFiles } from "./mention";
import { files as shortCutsFiles } from "./short-cuts";
import { files as slashCommandFiles } from "./slash-command";
import { files as speechToTextFiles } from "./speech-to-text";
import { files as tabFocusFiles } from "./tab-focus";
import { files as tableFiles } from "./table";
import { files as tailwindFiles } from "./tailwind";

export interface ExampleFile {
  name: string;
  code: string;
  lang: string;
}

export interface ExampleDefinition {
  component: ReturnType<typeof lazy>;
  files: ExampleFile[];
}

export const examples: Record<string, ExampleDefinition> = {
  "quick-example": {
    component: lazy(() => import("./quick-example")),
    files: quickExampleFiles,
  },
  "auto-complete": {
    component: lazy(() => import("./auto-complete")),
    files: autoCompleteFiles,
  },
  "auto-link": {
    component: lazy(() => import("./auto-link")),
    files: autoLinkFiles,
  },
  "code-block": {
    component: lazy(() => import("./code-block")),
    files: codeBlockFiles,
  },
  "code-block-prettier": {
    component: lazy(() => import("./code-block-prettier")),
    files: codeBlockPrettierFiles,
  },
  "code-highlight-prism": {
    component: lazy(() => import("./code-highlight-prism")),
    files: codeHighlightPrismFiles,
  },
  "code-highlight-shiki": {
    component: lazy(() => import("./code-highlight-shiki")),
    files: codeHighlightShikiFiles,
  },
  collapsible: {
    component: lazy(() => import("./collapsible")),
    files: collapsibleFiles,
  },
  "context-menu": {
    component: lazy(() => import("./context-menu")),
    files: contextMenuFiles,
  },
  "drag-drop-paste": {
    component: lazy(() => import("./drag-drop-paste")),
    files: dragDropPasteFiles,
  },
  "draggable-block": {
    component: lazy(() => import("./draggable-block")),
    files: draggableBlockFiles,
  },
  "floating-link": {
    component: lazy(() => import("./floating-link")),
    files: floatingLinkFiles,
  },
  image: {
    component: lazy(() => import("./image")),
    files: imageFiles,
  },
  keywords: {
    component: lazy(() => import("./keywords")),
    files: keywordsFiles,
  },
  link: {
    component: lazy(() => import("./link")),
    files: linkFiles,
  },
  "markdown-shortcuts": {
    component: lazy(() => import("./markdown-shortcuts")),
    files: markdownShortcutsFiles,
  },
  "character-limit": {
    component: lazy(() => import("./character-limit")),
    files: characterLimitFiles,
  },
  "max-length": {
    component: lazy(() => import("./max-length")),
    files: maxLengthFiles,
  },
  mention: {
    component: lazy(() => import("./mention")),
    files: mentionFiles,
  },
  "short-cuts": {
    component: lazy(() => import("./short-cuts")),
    files: shortCutsFiles,
  },
  "slash-command": {
    component: lazy(() => import("./slash-command")),
    files: slashCommandFiles,
  },
  "speech-to-text": {
    component: lazy(() => import("./speech-to-text")),
    files: speechToTextFiles,
  },
  "tab-focus": {
    component: lazy(() => import("./tab-focus")),
    files: tabFocusFiles,
  },
  table: {
    component: lazy(() => import("./table")),
    files: tableFiles,
  },
  tailwind: {
    component: lazy(() => import("./tailwind")),
    files: tailwindFiles,
  },
  "ui-mark-button": {
    component: lazy(() => import("./ui/mark-button")),
    files: uiMarkButtonFiles,
  },
  "ui-heading-button": {
    component: lazy(() => import("./ui/heading-button")),
    files: uiHeadingButtonFiles,
  },
  "ui-block-buttons": {
    component: lazy(() => import("./ui/block-buttons")),
    files: uiBlockButtonsFiles,
  },
  "ui-list-dropdown": {
    component: lazy(() => import("./ui/list-dropdown")),
    files: uiListDropdownFiles,
  },
  "ui-text-align": {
    component: lazy(() => import("./ui/text-align")),
    files: uiTextAlignFiles,
  },
  "ui-undo-redo": {
    component: lazy(() => import("./ui/undo-redo")),
    files: uiUndoRedoFiles,
  },
  "ui-clear-formatting": {
    component: lazy(() => import("./ui/clear-formatting")),
    files: uiClearFormattingFiles,
  },
  "ui-color-text": {
    component: lazy(() => import("./ui/color-text")),
    files: uiColorTextFiles,
  },
  "ui-color-highlight": {
    component: lazy(() => import("./ui/color-highlight")),
    files: uiColorHighlightFiles,
  },
  "ui-font-size": {
    component: lazy(() => import("./ui/font-size")),
    files: uiFontSizeFiles,
  },
  "ui-font-family": {
    component: lazy(() => import("./ui/font-family")),
    files: uiFontFamilyFiles,
  },
};
