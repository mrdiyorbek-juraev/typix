import type {
  LexicalEditor,
  LexicalNode,
  Klass,
  HTMLConfig,
  SerializedEditorState,
} from "lexical";
import { describe, expect, it, vi } from "vitest";
import { createEditorConfig } from "../../config/editor-config";

describe("createEditorConfig", () => {
  describe("default values", () => {
    it("returns default namespace when not provided", () => {
      const config = createEditorConfig();
      expect(config.namespace).toBe("typix-editor");
    });

    it("returns editable as true by default", () => {
      const config = createEditorConfig();
      expect(config.editable).toBe(true);
    });

    it("returns empty nodes array when extension_nodes not provided", () => {
      const config = createEditorConfig({});
      expect(config.nodes).toEqual([]);
    });

    it("returns default onError that logs to console", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const config = createEditorConfig();
      const testError = new Error("Test error");

      config.onError(testError, {} as LexicalEditor);

      expect(consoleSpy).toHaveBeenCalledWith(testError);
      consoleSpy.mockRestore();
    });

    it("does not include editorState when not provided", () => {
      const config = createEditorConfig();
      expect(config.editorState).toBeUndefined();
    });

    it("does not include theme when not provided", () => {
      const config = createEditorConfig();
      expect(config.theme).toBeUndefined();
    });

    it("does not include html config when not provided", () => {
      const config = createEditorConfig();
      expect(config.html).toBeUndefined();
    });
  });

  describe("custom values", () => {
    it("uses provided namespace", () => {
      const config = createEditorConfig({ namespace: "my-editor" });
      expect(config.namespace).toBe("my-editor");
    });

    it("uses provided editable value", () => {
      const config = createEditorConfig({ editable: false });
      expect(config.editable).toBe(false);
    });

    it("uses provided extension_nodes", () => {
      const mockNode = class MockNode {} as unknown as Klass<LexicalNode>;
      const config = createEditorConfig({ extension_nodes: [mockNode] });
      expect(config.nodes).toEqual([mockNode]);
    });

    it("creates a copy of extension_nodes array", () => {
      const mockNode = class MockNode {} as unknown as Klass<LexicalNode>;
      const extensionNodes = [mockNode];
      const config = createEditorConfig({ extension_nodes: extensionNodes });
      expect(config.nodes).not.toBe(extensionNodes);
      expect(config.nodes).toEqual(extensionNodes);
    });

    it("uses provided custom onError handler", () => {
      const customOnError = vi.fn();
      const config = createEditorConfig({ onError: customOnError });
      const testError = new Error("Test error");
      const mockEditor = {} as LexicalEditor;

      config.onError(testError, mockEditor);

      expect(customOnError).toHaveBeenCalledWith(testError, mockEditor);
    });

    it("uses provided theme", () => {
      const theme = { paragraph: "my-paragraph-class" };
      const config = createEditorConfig({ theme });
      expect(config.theme).toBe(theme);
    });

    it("uses provided html config", () => {
      const htmlConfig: HTMLConfig = {
        export: new Map(),
        import: undefined,
      };
      const config = createEditorConfig({ html: htmlConfig });
      expect(config.html).toBe(htmlConfig);
    });
  });

  describe("editor state handling", () => {
    it("uses editorState directly when provided", () => {
      const editorState = '{"root":{"children":[],"type":"root"}}';
      const config = createEditorConfig({ editorState });
      expect(config.editorState).toBe(editorState);
    });

    it("converts initialState to JSON string", () => {
      const initialState: SerializedEditorState = {
        root: {
          children: [],
          direction: null,
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      };
      const config = createEditorConfig({ initialState });
      expect(config.editorState).toBe(JSON.stringify(initialState));
    });

    it("initialState takes precedence over editorState due to spread order", () => {
      const editorState = '{"root":{"type":"old"}}';
      const initialState: SerializedEditorState = {
        root: {
          children: [],
          direction: null,
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      };
      const config = createEditorConfig({ editorState, initialState });
      expect(config.editorState).toBe(JSON.stringify(initialState));
    });

    it("accepts function as editorState", () => {
      const editorStateFn = (editor: LexicalEditor) => {};
      const config = createEditorConfig({ editorState: editorStateFn });
      expect(config.editorState).toBe(editorStateFn);
    });
  });

  describe("empty options", () => {
    it("works with empty object", () => {
      const config = createEditorConfig({});
      expect(config.namespace).toBe("typix-editor");
      expect(config.editable).toBe(true);
      expect(config.nodes).toEqual([]);
    });

    it("works with no arguments", () => {
      const config = createEditorConfig();
      expect(config.namespace).toBe("typix-editor");
      expect(config.editable).toBe(true);
      expect(config.nodes).toEqual([]);
    });
  });
});
