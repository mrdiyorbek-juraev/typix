import { describe, expect, it } from "vitest";
import { SlashCommandExtension, getSlashCommandOutput } from "../extension";
import { canInsertSlashCommand, insertSlashCommand } from "../utils";
import {
  createEditor,
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  ParagraphNode,
} from "lexical";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createTestEditor() {
  return createEditor({
    namespace: "test",
    nodes: [ParagraphNode],
    onError: (e) => {
      throw e;
    },
  });
}

// ─── Extension factory ───────────────────────────────────────────────────────

describe("SlashCommandExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = SlashCommandExtension();
      expect(ext.name).toBe("slash-command");
      expect(ext.typix).toBeDefined();
      expect(ext.config).toBeDefined();
    });

    it("includes insertSlashCommand command", () => {
      const ext = SlashCommandExtension();
      expect(ext.commands).toHaveProperty("insertSlashCommand");
    });

    it("includes Mod+/ shortcut", () => {
      const ext = SlashCommandExtension();
      expect(ext.shortcuts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: "/",
            modifiers: ["mod"],
            command: "insertSlashCommand",
          }),
        ])
      );
    });
  });

  describe("config defaults", () => {
    it("sets trigger to '/' by default", () => {
      const ext = SlashCommandExtension();
      expect(ext.config?.trigger).toBe("/");
    });

    it("sets disabled to false by default", () => {
      const ext = SlashCommandExtension();
      expect(ext.config?.disabled).toBe(false);
    });
  });

  describe("config overrides", () => {
    it("accepts custom trigger", () => {
      const ext = SlashCommandExtension({ trigger: "!" });
      expect(ext.config?.trigger).toBe("!");
    });

    it("accepts disabled override", () => {
      const ext = SlashCommandExtension({ disabled: true });
      expect(ext.config?.disabled).toBe(true);
    });

    it("merges partial config with defaults", () => {
      const ext = SlashCommandExtension({ trigger: "#" });
      expect(ext.config?.trigger).toBe("#");
      expect(ext.config?.disabled).toBe(false);
    });
  });
});

// ─── getSlashCommandOutput ───────────────────────────────────────────────────

describe("getSlashCommandOutput", () => {
  it("returns undefined for an editor not registered with the extension", () => {
    const editor = createTestEditor();
    expect(getSlashCommandOutput(editor)).toBeUndefined();
  });
});

// ─── canInsertSlashCommand ───────────────────────────────────────────────────

describe("canInsertSlashCommand", () => {
  describe("with node argument", () => {
    it("returns true for an empty element node", () => {
      const editor = createTestEditor();
      let paragraph!: InstanceType<typeof ParagraphNode>;

      editor.update(
        () => {
          paragraph = $createParagraphNode();
          $getRoot().append(paragraph);
        },
        { discrete: true }
      );

      const result = canInsertSlashCommand(editor, paragraph);
      expect(result).toBe(true);
    });

    it("returns false for an element node with children", () => {
      const editor = createTestEditor();
      let paragraph!: InstanceType<typeof ParagraphNode>;

      editor.update(
        () => {
          paragraph = $createParagraphNode();
          paragraph.append($createTextNode("hello"));
          $getRoot().append(paragraph);
        },
        { discrete: true }
      );

      const result = canInsertSlashCommand(editor, paragraph);
      expect(result).toBe(false);
    });

    it("returns false for a text node", () => {
      const editor = createTestEditor();
      let text!: ReturnType<typeof $createTextNode>;

      editor.update(
        () => {
          const paragraph = $createParagraphNode();
          text = $createTextNode("hello");
          paragraph.append(text);
          $getRoot().append(paragraph);
        },
        { discrete: true }
      );

      const result = canInsertSlashCommand(editor, text);
      expect(result).toBe(false);
    });
  });

  describe("selection-based (no node argument)", () => {
    it("returns true when cursor is in an empty paragraph", () => {
      const editor = createTestEditor();
      let result = false;

      editor.update(
        () => {
          const paragraph = $createParagraphNode();
          $getRoot().append(paragraph);
          paragraph.select(0, 0);
        },
        { discrete: true }
      );

      editor.getEditorState().read(() => {
        result = canInsertSlashCommand(editor);
      });

      expect(result).toBe(true);
    });

    it("returns true when cursor is at the start of a text node with only whitespace before it", () => {
      const editor = createTestEditor();
      let result = false;

      editor.update(
        () => {
          const paragraph = $createParagraphNode();
          const text = $createTextNode("  ");
          paragraph.append(text);
          $getRoot().append(paragraph);
          text.select(0, 0);
        },
        { discrete: true }
      );

      editor.getEditorState().read(() => {
        result = canInsertSlashCommand(editor);
      });

      expect(result).toBe(true);
    });

    it("returns false when cursor is after non-whitespace text", () => {
      const editor = createTestEditor();
      let result = true;

      editor.update(
        () => {
          const paragraph = $createParagraphNode();
          const text = $createTextNode("hello");
          paragraph.append(text);
          $getRoot().append(paragraph);
          text.select(5, 5);
        },
        { discrete: true }
      );

      editor.getEditorState().read(() => {
        result = canInsertSlashCommand(editor);
      });

      expect(result).toBe(false);
    });
  });
});

// ─── insertSlashCommand ──────────────────────────────────────────────────────

describe("insertSlashCommand", () => {
  it("returns true optimistically", () => {
    const editor = createTestEditor();
    let returnValue = false;

    editor.update(
      () => {
        const paragraph = $createParagraphNode();
        $getRoot().append(paragraph);
        paragraph.select(0, 0);
      },
      { discrete: true }
    );

    editor.update(
      () => {
        returnValue = insertSlashCommand(editor);
      },
      { discrete: true }
    );

    expect(returnValue).toBe(true);
  });

  it("uses '/' as default trigger", () => {
    const editor = createTestEditor();
    let insertedText = "";

    editor.update(
      () => {
        const paragraph = $createParagraphNode();
        $getRoot().append(paragraph);
        paragraph.select(0, 0);
      },
      { discrete: true }
    );

    editor.update(
      () => {
        insertSlashCommand(editor);
      },
      { discrete: true }
    );

    editor.getEditorState().read(() => {
      insertedText = $getRoot().getTextContent();
    });

    expect(insertedText).toBe("/");
  });

  it("uses custom trigger when provided", () => {
    const editor = createTestEditor();
    let insertedText = "";

    editor.update(
      () => {
        const paragraph = $createParagraphNode();
        $getRoot().append(paragraph);
        paragraph.select(0, 0);
      },
      { discrete: true }
    );

    editor.update(
      () => {
        insertSlashCommand(editor, "!");
      },
      { discrete: true }
    );

    editor.getEditorState().read(() => {
      insertedText = $getRoot().getTextContent();
    });

    expect(insertedText).toBe("!");
  });

  it("inserts trigger at the start of a given empty element node", () => {
    const editor = createTestEditor();
    let insertedText = "";

    editor.update(
      () => {
        const paragraph = $createParagraphNode();
        $getRoot().append(paragraph);
        insertSlashCommand(editor, "/", paragraph);
      },
      { discrete: true }
    );

    editor.getEditorState().read(() => {
      insertedText = $getRoot().getTextContent();
    });

    expect(insertedText).toBe("/");
  });
});
