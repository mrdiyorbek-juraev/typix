import { describe, it, expect, vi } from "vitest";
import { createCommand } from "../../command-menu/create-command";
import { CommandMenuOption } from "../../command-menu/command-menu";

describe("createCommand", () => {
  const baseConfig = {
    title: "Heading",
    onSelect: vi.fn(),
  };

  it("returns a CommandMenuOption instance", () => {
    const option = createCommand(baseConfig);
    expect(option).toBeInstanceOf(CommandMenuOption);
  });

  it("sets the title", () => {
    const option = createCommand(baseConfig);
    expect(option.title).toBe("Heading");
  });

  it("maps keywords from config", () => {
    const option = createCommand({
      ...baseConfig,
      keywords: ["h1", "title"],
    });
    expect(option.keywords).toEqual(["h1", "title"]);
  });

  it("defaults keywords to empty array when not provided", () => {
    const option = createCommand(baseConfig);
    expect(option.keywords).toEqual([]);
  });

  it("maps description to shortDescription", () => {
    const option = createCommand({
      ...baseConfig,
      description: "Insert heading",
    });
    expect(option.shortDescription).toBe("Insert heading");
  });

  it("maps shortcut to keyboardShortcut", () => {
    const option = createCommand({
      ...baseConfig,
      shortcut: "Ctrl+H",
    });
    expect(option.keyboardShortcut).toBe("Ctrl+H");
  });

  it("maps icon from config", () => {
    const icon = {} as any;
    const option = createCommand({
      ...baseConfig,
      icon,
    });
    expect(option.icon).toBe(icon);
  });

  it("wraps onSelect to call editor.update", () => {
    const onSelect = vi.fn();
    const option = createCommand({ ...baseConfig, onSelect });

    const mockEditor = {
      update: vi.fn((fn: () => void) => fn()),
    } as any;

    option.onSelect("query", mockEditor);

    expect(mockEditor.update).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith("query", mockEditor);
  });
});
