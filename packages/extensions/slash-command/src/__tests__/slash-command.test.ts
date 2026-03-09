import { describe, expect, it } from "vitest";
import { configExtension } from "lexical";
import { getTypixMeta, getExtensionOutput } from "@typix-editor/core";
import { SlashCommandExtension } from "../extension";
import { canInsertSlashCommand, insertSlashCommand } from "../utils";
import {
  createEditor,
  $getRoot,
  $createParagraphNode,
  $createTextNode,
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

// ─── Static extension ────────────────────────────────────────────────────────

describe("SlashCommandExtension", () => {
  describe("static extension", () => {
    it("is a valid extension definition", () => {
      expect(SlashCommandExtension.name).toBe("@typix/slash-command");
      expect(SlashCommandExtension.config).toBeDefined();
    });

    it("includes insertSlashCommand command", () => {
      expect(getTypixMeta(SlashCommandExtension)?.commands).toHaveProperty(
        "insertSlashCommand"
      );
    });

    it("includes Mod+/ shortcut", () => {
      expect(getTypixMeta(SlashCommandExtension)?.shortcuts).toEqual(
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
      expect(SlashCommandExtension.config?.trigger).toBe("/");
    });

    it("sets disabled to false by default", () => {
      expect(SlashCommandExtension.config?.disabled).toBe(false);
    });
  });

  describe("config overrides via configExtension", () => {
    it("accepts custom trigger", () => {
      const [, override] = configExtension(SlashCommandExtension, {
        trigger: "!",
      });
      expect(override.trigger).toBe("!");
    });

    it("accepts disabled override", () => {
      const [, override] = configExtension(SlashCommandExtension, {
        disabled: true,
      });
      expect(override.disabled).toBe(true);
    });

    it("merges partial config with defaults via mergeConfig", () => {
      const merged = SlashCommandExtension.mergeConfig!(
        SlashCommandExtension.config!,
        { trigger: "#" }
      );
      expect(merged.trigger).toBe("#");
      expect(merged.disabled).toBe(false);
    });
  });
});

// ─── getExtensionOutput ───────────────────────────────────────────────────────

describe("getExtensionOutput (SlashCommandExtension)", () => {
  it("returns undefined for an editor not registered with the extension", () => {
    const editor = createTestEditor();
    expect(getExtensionOutput(editor, SlashCommandExtension)).toBeUndefined();
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
