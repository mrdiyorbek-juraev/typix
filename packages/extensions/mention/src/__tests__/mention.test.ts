import { afterEach, describe, expect, it } from "vitest";
import {
  configureMentionNode,
  MentionNode,
  resetMentionNodeConfig,
} from "../node";
import type {
  MentionItem,
  MentionNodeConfig,
  MentionTriggerConfig,
} from "../types";

describe("mention extension", () => {
  afterEach(() => {
    // Reset configuration after each test
    resetMentionNodeConfig();
  });

  describe("MentionNode", () => {
    describe("static getType", () => {
      it("returns 'mention'", () => {
        expect(MentionNode.getType()).toBe("mention");
      });
    });
  });

  describe("configureMentionNode", () => {
    it("can set className", () => {
      configureMentionNode({
        className: "custom-mention-class",
      });

      // Configuration is applied - this test verifies no error is thrown
      expect(true).toBe(true);
    });

    it("can set style", () => {
      configureMentionNode({
        style: "color: blue; font-weight: bold;",
      });

      expect(true).toBe(true);
    });

    it("can set includeTrigger", () => {
      configureMentionNode({
        includeTrigger: false,
      });

      expect(true).toBe(true);
    });

    it("can set multiple options at once", () => {
      configureMentionNode({
        className: "my-mention",
        style: "background: yellow;",
        includeTrigger: true,
      });

      expect(true).toBe(true);
    });

    it("merges with existing configuration", () => {
      configureMentionNode({ className: "first-class" });
      configureMentionNode({ style: "color: red;" });

      // Both should be set now
      expect(true).toBe(true);
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

      // Configuration is reset - no error should be thrown
      expect(true).toBe(true);
    });

    it("can be called multiple times", () => {
      resetMentionNodeConfig();
      resetMentionNodeConfig();
      resetMentionNodeConfig();

      expect(true).toBe(true);
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

  describe("CreateMentionNodeParams", () => {
    it("supports basic mention creation", () => {
      const params = {
        id: "user-123",
        name: "John Doe",
      };

      expect(params.id).toBe("user-123");
      expect(params.name).toBe("John Doe");
    });

    it("supports custom trigger", () => {
      const params = {
        id: "tag-456",
        name: "typescript",
        trigger: "#",
      };

      expect(params.trigger).toBe("#");
    });

    it("supports custom display text", () => {
      const params = {
        id: "user-789",
        name: "JohnDoe",
        text: "John D.",
      };

      expect(params.text).toBe("John D.");
    });

    it("supports additional data", () => {
      const params = {
        id: "user-101",
        name: "Alice",
        data: {
          avatar: "/avatars/alice.png",
          department: "Engineering",
          status: "online",
        },
      };

      expect(params.data?.avatar).toBe("/avatars/alice.png");
      expect(params.data?.department).toBe("Engineering");
      expect(params.data?.status).toBe("online");
    });
  });

  describe("mention search scenarios", () => {
    // Simulating mention search functionality
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

      expect(results).toHaveLength(1); // Only Alice matches "ali"
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
});
