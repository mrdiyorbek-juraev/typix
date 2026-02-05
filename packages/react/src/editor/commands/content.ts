import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import {
  $createParagraphNode,
  $getRoot,
  $insertNodes,
  type LexicalEditor,
  type SerializedEditorState,
} from "lexical";

// ============================================
// EXPORT
// ============================================

/**
 * Get the editor content as serialized JSON.
 */
export function getJSON(editor: LexicalEditor): SerializedEditorState {
  return editor.getEditorState().toJSON();
}

/**
 * Get the editor content as HTML string.
 */
export function getHTML(editor: LexicalEditor): string {
  return editor.getEditorState().read(() => {
    return $generateHtmlFromNodes(editor, null);
  });
}

/**
 * Get the editor content as Markdown string.
 */
export function getMarkdown(editor: LexicalEditor): string {
  return editor.getEditorState().read(() => {
    return $convertToMarkdownString(TRANSFORMERS);
  });
}

/**
 * Get the editor content as plain text.
 */
export function getText(editor: LexicalEditor): string {
  return editor.getEditorState().read(() => {
    return $getRoot().getTextContent();
  });
}

// ============================================
// IMPORT
// ============================================

/**
 * Set the editor content from serialized JSON.
 */
export function setJSON(editor: LexicalEditor, json: SerializedEditorState): void {
  const editorState = editor.parseEditorState(json);
  editor.setEditorState(editorState);
  editor.focus();
}

/**
 * Set the editor content from HTML string.
 */
export function setHTML(editor: LexicalEditor, html: string): void {
  editor.update(() => {
    const root = $getRoot();
    root.clear();

    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    const nodes = $generateNodesFromDOM(editor, dom);

    $insertNodes(nodes);
    editor.focus();
  });
}

/**
 * Set the editor content from Markdown string.
 */
export function setMarkdown(editor: LexicalEditor, markdown: string): void {
  editor.update(() => {
    const root = $getRoot();
    root.clear();
    $convertFromMarkdownString(markdown, TRANSFORMERS);
    editor.focus();
  }); 
}

/**
 * Clear all content from the editor.
 */
export function clearContent(editor: LexicalEditor): void {
  editor.update(() => {
    const root = $getRoot();
    root.clear();
    const paragraph = $createParagraphNode();
    root.append(paragraph);
    paragraph.select(); 
  });
}
