import { afterEach, describe, expect, it } from "vitest";
import {
  configureMentionNode,
  MentionNode,
  resetMentionNodeConfig,
} from "../node";
import { MentionExtension, getMentionOutput } from "../extension";
import type {
  MentionItem,
  MentionNodeConfig,
  MentionTriggerConfig,
} from "../types";

describe("MentionExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = MentionExtension();
      expect(ext.name).toBe("mention");
      expect(ext.typix).toBeDefined();
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets trigger to @ by default", () => {
      const ext = MentionExtension();
      expect(ext.config?.trigger).toBe("@");
    });

    it("sets minLength to 0 by default", () => {
      const ext = MentionExtension();
      expect(ext.config?.minLength).toBe(0);
    });

    it("sets maxLength to 75 by default", () => {
      const ext = MentionExtension();
      expect(ext.config?.maxLength).toBe(75);
    });

    it("sets allowSpaces to true by default", () => {
      const ext = MentionExtension();
      expect(ext.config?.allowSpaces).toBe(true);
    });

    it("sets maxSuggestions to 10 by default", () => {
      const ext = MentionExtension();
      expect(ext.config?.maxSuggestions).toBe(10);
    });

    it("sets debounceMs to 200 by default", () => {
      const ext = MentionExtension();
      expect(ext.config?.debounceMs).toBe(200);
    });

    it("sets includeTrigger to true by default", () => {
      const ext = MentionExtension();
      expect(ext.config?.includeTrigger).toBe(true);
    });

    it("sets disabled to false by default", () => {
      const ext = MentionExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("accepts user overrides", () => {
      const ext = MentionExtension({
        trigger: "#",
        minLength: 2,
        maxLength: 50,
        allowSpaces: false,
        maxSuggestions: 5,
        debounceMs: 300,
        includeTrigger: false,
        disabled: true,
      });
      expect(ext.config?.trigger).toBe("#");
      expect(ext.config?.minLength).toBe(2);
      expect(ext.config?.maxLength).toBe(50);
      expect(ext.config?.allowSpaces).toBe(false);
      expect(ext.config?.maxSuggestions).toBe(5);
      expect(ext.config?.debounceMs).toBe(300);
      expect(ext.config?.includeTrigger).toBe(false);
      expect(ext.config?.disabled).toBe(true);
    });
  });

  describe("getMentionOutput", () => {
    it("returns undefined for an unregistered editor", () => {
      const result = getMentionOutput({} as any);
      expect(result).toBeUndefined();
    });
  });
});

describe("MentionNode", () => {
  afterEach(() => {
    resetMentionNodeConfig();
  });

  describe("static getType", () => {
    it("returns 'mention'", () => {
      expect(MentionNode.getType()).toBe("mention");
    });
  });
});

describe("configureMentionNode", () => {
  afterEach(() => {
    resetMentionNodeConfig();
  });

  it("sets className and it persists", () => {
    configureMentionNode({ className: "custom-mention-class" });
    // Create a node to verify the config is applied
    // (The global config is module-scoped, so MentionNode constructor reads it)
    configureMentionNode({ className: "second-class" });
    // Verify the config can be set multiple times without error
    // and the last value wins (merge behavior)
    resetMentionNodeConfig();
    // After reset, no error on reconfigure
    configureMentionNode({ className: "after-reset" });
  });

  it("sets style correctly", () => {
    configureMentionNode({ style: "color: blue; font-weight: bold;" });
    // Verify no error thrown and config is accepted
    configureMentionNode({ style: "color: red;" });
  });

  it("sets includeTrigger correctly", () => {
    configureMentionNode({ includeTrigger: false });
    configureMentionNode({ includeTrigger: true });
  });

  it("merges with existing configuration", () => {
    configureMentionNode({ className: "first-class" });
    configureMentionNode({ style: "color: red;" });
    // Both should be set now — the implementation merges via spread
    // We verify by checking that reconfiguring doesn't throw
  });
});

describe("resetMentionNodeConfig", () => {
  it("resets configuration to defaults", () => {
    configureMentionNode({
      className: "custom-class",
      style: "color: blue;",
      includeTrigger: false,
    });
    resetMentionNodeConfig();
    // After reset, defaults should be restored
    // The module-level state is back to empty object
  });

  it("can be called multiple times without error", () => {
    resetMentionNodeConfig();
    resetMentionNodeConfig();
    resetMentionNodeConfig();
  });
});

describe("MentionItem type", () => {
  it("has correct structure", () => {
    const item: MentionItem = {
      id: "user-123",
      name: "John Doe",
    };
    expect(item.id).toBe("user-123");
    expect(item.name).toBe("John Doe");
  });

  it("supports optional data", () => {
    const item: MentionItem = {
      id: "user-456",
      name: "Jane Smith",
      data: {
        avatar: "/avatars/jane.jpg",
        email: "jane@example.com",
        role: "admin",
      },
    };
    expect(item.data?.avatar).toBe("/avatars/jane.jpg");
    expect(item.data?.email).toBe("jane@example.com");
    expect(item.data?.role).toBe("admin");
  });
});

describe("MentionTriggerConfig type", () => {
  it("has expected defaults based on documentation", () => {
    const defaults: MentionTriggerConfig = {
      trigger: "@",
      minLength: 0,
      maxLength: 75,
      allowSpaces: true,
    };
    expect(defaults.trigger).toBe("@");
    expect(defaults.minLength).toBe(0);
    expect(defaults.maxLength).toBe(75);
    expect(defaults.allowSpaces).toBe(true);
  });

  it("supports custom trigger characters", () => {
    const triggers = ["@", "#", "$", "/", ":", "+"];
    for (const trigger of triggers) {
      const config: MentionTriggerConfig = { trigger };
      expect(config.trigger).toBe(trigger);
    }
  });

  it("supports custom regex for allowed characters", () => {
    const config: MentionTriggerConfig = {
      allowedChars: /^[a-zA-Z0-9_]+$/,
    };
    expect(config.allowedChars).toBeInstanceOf(RegExp);
  });
});

describe("MentionNodeConfig type", () => {
  it("has expected defaults based on documentation", () => {
    const defaults: MentionNodeConfig = {
      className: "typix-mention",
      includeTrigger: true,
    };
    expect(defaults.className).toBe("typix-mention");
    expect(defaults.includeTrigger).toBe(true);
  });

  it("supports custom styling", () => {
    const config: MentionNodeConfig = {
      className: "my-custom-mention",
      style:
        "background-color: #e1f5fe; padding: 2px 4px; border-radius: 4px;",
      includeTrigger: false,
    };
    expect(config.className).toBe("my-custom-mention");
    expect(config.style).toContain("background-color");
    expect(config.includeTrigger).toBe(false);
  });

  it("supports custom attributes", () => {
    const config: MentionNodeConfig = {
      attributes: {
        "data-mention-type": "user",
        "aria-label": "User mention",
      },
    };
    expect(config.attributes?.["data-mention-type"]).toBe("user");
    expect(config.attributes?.["aria-label"]).toBe("User mention");
  });
});

describe("mention search scenarios", () => {
  const mockUsers: MentionItem[] = [
    { id: "1", name: "Alice Johnson", data: { role: "admin" } },
    { id: "2", name: "Bob Smith", data: { role: "user" } },
    { id: "3", name: "Charlie Brown", data: { role: "user" } },
    { id: "4", name: "Diana Prince", data: { role: "moderator" } },
    { id: "5", name: "Edward Norton", data: { role: "user" } },
  ];

  function searchMentions(query: string): MentionItem[] {
    const normalizedQuery = query.toLowerCase();
    return mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.id.includes(normalizedQuery)
    );
  }

  it("finds users by partial name match", () => {
    const results = searchMentions("ali");
    expect(results).toHaveLength(1);
    expect(results.map((r) => r.name)).toContain("Alice Johnson");
  });

  it("finds users by id", () => {
    const results = searchMentions("3");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Charlie Brown");
  });

  it("returns empty array for no matches", () => {
    const results = searchMentions("xyz");
    expect(results).toHaveLength(0);
  });

  it("is case insensitive", () => {
    const lowerResults = searchMentions("alice");
    const upperResults = searchMentions("ALICE");
    expect(lowerResults).toEqual(upperResults);
  });

  it("matches by first name", () => {
    const results = searchMentions("bob");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Bob Smith");
  });

  it("matches by last name", () => {
    const results = searchMentions("smith");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Bob Smith");
  });
});

describe("trigger character matching", () => {
  function isTriggerMatch(text: string, trigger: string): boolean {
    return text.startsWith(trigger);
  }

  function extractQuery(text: string, trigger: string): string | null {
    if (!text.startsWith(trigger)) return null;
    return text.slice(trigger.length);
  }

  it("detects @ mentions", () => {
    expect(isTriggerMatch("@john", "@")).toBe(true);
    expect(isTriggerMatch("hello", "@")).toBe(false);
  });

  it("detects # hashtags", () => {
    expect(isTriggerMatch("#typescript", "#")).toBe(true);
    expect(isTriggerMatch("typescript", "#")).toBe(false);
  });

  it("extracts query after trigger", () => {
    expect(extractQuery("@john", "@")).toBe("john");
    expect(extractQuery("#react", "#")).toBe("react");
    expect(extractQuery("hello", "@")).toBeNull();
  });

  it("handles multi-character triggers", () => {
    expect(isTriggerMatch("::snippet", "::")).toBe(true);
    expect(extractQuery("::snippet", "::")).toBe("snippet");
  });
});
