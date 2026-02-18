import { lazy } from "react";
import { files as quickExampleFiles } from "./quick-example";
import { files as autoCompleteFiles } from "./auto-complete";
import { files as autoLinkFiles } from "./auto-link";
import { files as codeHighlightPrismFiles } from "./code-highlight-prism";
import { files as codeHighlightShikiFiles } from "./code-highlight-shiki";
import { files as collapsibleFiles } from "./collapsible";
import { files as contextMenuFiles } from "./context-menu";
import { files as dragDropPasteFiles } from "./drag-drop-paste";
import { files as draggableBlockFiles } from "./draggable-block";
import { files as floatingLinkFiles } from "./floating-link";
import { files as keywordsFiles } from "./keywords";
import { files as linkFiles } from "./link";
import { files as maxLengthFiles } from "./max-length";
import { files as mentionFiles } from "./mention";
import { files as shortCutsFiles } from "./short-cuts";
import { files as speechToTextFiles } from "./speech-to-text";
import { files as tabFocusFiles } from "./tab-focus";

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
  keywords: {
    component: lazy(() => import("./keywords")),
    files: keywordsFiles,
  },
  link: {
    component: lazy(() => import("./link")),
    files: linkFiles,
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
  "speech-to-text": {
    component: lazy(() => import("./speech-to-text")),
    files: speechToTextFiles,
  },
  "tab-focus": {
    component: lazy(() => import("./tab-focus")),
    files: tabFocusFiles,
  },
};
