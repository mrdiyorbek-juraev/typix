export type ExampleCategory = "editor" | "collaboration" | "ai";

export interface ExampleConfig {
  slug: string;
  title: string;
  description: string;
  category: ExampleCategory;
  available: boolean;
}

export const categories: { value: ExampleCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "editor", label: "Editor" },
  { value: "ai", label: "AI" },
  { value: "collaboration", label: "Collaboration" },
];

export const examples: ExampleConfig[] = [
  {
    slug: "default-editor",
    title: "Default text editor",
    description: "Learn how to create a default rich text editor with Typix.",
    category: "editor",
    available: true,
  },
  {
    slug: "markdown-shortcuts",
    title: "Markdown shortcuts",
    description: "Add markdown shortcuts to your Typix Editor.",
    category: "editor",
    available: true,
  },
  {
    slug: "tables",
    title: "Tables",
    description: "Add tables to your Typix Editor.",
    category: "editor",
    available: false,
  },
  {
    slug: "images",
    title: "Images",
    description: "Add images to your Typix Editor.",
    category: "editor",
    available: false,
  },
  {
    slug: "formatting",
    title: "Formatting",
    description: "Add content formatting to your Typix Editor.",
    category: "editor",
    available: true,
  },
  {
    slug: "tasks",
    title: "Tasks",
    description: "Add task lists to your Typix Editor.",
    category: "editor",
    available: false,
  },
  {
    slug: "ai-chat",
    title: "AI Chat Interface",
    description:
      "A conversational editor with markdown rendering and streaming-style input.",
    category: "ai",
    available: false,
  },
  {
    slug: "ai-autocomplete",
    title: "AI Autocomplete",
    description: "AI-powered inline autocomplete suggestions as you type.",
    category: "ai",
    available: false,
  },
  {
    slug: "slack-messenger",
    title: "Slack / Discord Messenger",
    description:
      "A messaging-style editor with mentions, emoji, and slash commands.",
    category: "collaboration",
    available: false,
  },
  {
    slug: "comment-thread",
    title: "Comment Thread",
    description:
      "A lightweight comment editor for forums with mentions and reactions.",
    category: "collaboration",
    available: false,
  },
  {
    slug: "minimal-note",
    title: "Minimal Note",
    description:
      "A clean, distraction-free writing experience for quick notes.",
    category: "editor",
    available: false,
  },
  {
    slug: "code-editor",
    title: "Code Editor",
    description:
      "Code blocks with syntax highlighting powered by Shiki or Prism.",
    category: "editor",
    available: false,
  },
];

export function getExampleBySlug(slug: string): ExampleConfig | undefined {
  return examples.find((e) => e.slug === slug);
}
