import { createHeadlessEditor } from "@lexical/headless";
import { $createMarkNode, MarkNode } from "@lexical/mark";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  ParagraphNode,
  TextNode,
} from "lexical";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearDocumentState,
  initializeDocumentState,
  validateEditorState,
} from "@typix-editor/core";

const createValidEditorState = () => {
  const editor = createHeadlessEditor({
    namespace: "test",
    nodes: [ParagraphNode, TextNode],
    onError: () => {},
  });

  editor.update(
    () => {
      const root = $getRoot();
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode("Hello world"));
      root.append(paragraph);
    },
    { discrete: true }
  );

  return JSON.stringify(editor.getEditorState().toJSON());
};

const createEmptyEditorState = () => {
  const editor = createHeadlessEditor({
    namespace: "test",
    nodes: [ParagraphNode, TextNode],
    onError: () => {},
  });

  return JSON.stringify(editor.getEditorState().toJSON());
};

describe("validation", () => {
  const testNodes = [ParagraphNode, TextNode];

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    clearDocumentState("test-doc");
    clearDocumentState("test-doc-1");
    clearDocumentState("test-doc-2");
    vi.restoreAllMocks();
  });

  describe("validateEditorState", () => {
    it("returns true for valid initial editor state", async () => {
      const editorState = createValidEditorState();
      const result = await validateEditorState(
        "test-doc",
        editorState,
        testNodes
      );
      expect(result).toBe(true);
    });

    it("returns true when same state is validated twice", async () => {
      const editorState = createValidEditorState();

      await validateEditorState("test-doc", editorState, testNodes);
      const result = await validateEditorState(
        "test-doc",
        editorState,
        testNodes
      );

      expect(result).toBe(true);
    });

    it("caches editor instance per document", async () => {
      const editorState = createValidEditorState();

      await validateEditorState("test-doc-1", editorState, testNodes);
      await validateEditorState("test-doc-2", editorState, testNodes);

      // Both should succeed with their own cached editors
      const result1 = await validateEditorState(
        "test-doc-1",
        editorState,
        testNodes
      );
      const result2 = await validateEditorState(
        "test-doc-2",
        editorState,
        testNodes
      );

      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it("logs initial state message on first validation", async () => {
      const editorState = createValidEditorState();
      await validateEditorState("test-doc", editorState, testNodes);

      expect(console.log).toHaveBeenCalledWith(
        "Initial state set for document test-doc"
      );
    });
  });

  describe("validateEditorState with MarkNode sanitization", () => {
    const nodesWithMark = [ParagraphNode, TextNode, MarkNode];

    it("sanitizes mark nodes from editor state", async () => {
      const editor = createHeadlessEditor({
        namespace: "test",
        nodes: nodesWithMark,
        onError: () => {},
      });

      editor.update(
        () => {
          const root = $getRoot();
          const paragraph = $createParagraphNode();
          const markNode = $createMarkNode(["comment-1"]);
          markNode.append($createTextNode("marked text"));
          paragraph.append(markNode);
          root.append(paragraph);
        },
        { discrete: true }
      );

      const stateWithMark = JSON.stringify(editor.getEditorState().toJSON());

      // First validation initializes the state (mark gets sanitized)
      const result = await validateEditorState(
        "test-doc",
        stateWithMark,
        nodesWithMark
      );
      expect(result).toBe(true);
    });
  });

  describe("initializeDocumentState", () => {
    it("initializes document state successfully", async () => {
      const editorState = createValidEditorState();

      await initializeDocumentState("test-doc", editorState, testNodes);

      // Subsequent validation with same state should return true
      const result = await validateEditorState(
        "test-doc",
        editorState,
        testNodes
      );
      expect(result).toBe(true);
    });

    it("logs initial state message", async () => {
      const editorState = createValidEditorState();
      await initializeDocumentState("test-doc", editorState, testNodes);

      expect(console.log).toHaveBeenCalledWith(
        "Initial state set for document test-doc"
      );
    });
  });

  describe("clearDocumentState", () => {
    it("clears document state and editor instance", async () => {
      const editorState = createValidEditorState();

      // Initialize state
      await validateEditorState("test-doc", editorState, testNodes);

      // Clear state
      clearDocumentState("test-doc");

      // Next validation should be treated as initial
      await validateEditorState("test-doc", editorState, testNodes);

      expect(console.log).toHaveBeenCalledWith(
        "Initial state set for document test-doc"
      );
    });

    it("handles clearing non-existent document gracefully", () => {
      expect(() => clearDocumentState("non-existent")).not.toThrow();
    });
  });
});
