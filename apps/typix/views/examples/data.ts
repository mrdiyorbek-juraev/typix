export type ExampleCategory = "editor" | "collaboration" | "ai";
export type ExampleComplexity = "beginner" | "intermediate" | "advanced";

export interface ExampleConfig {
  slug: string;
  title: string;
  description: string;
  category: ExampleCategory;
  available: boolean;
  previewName?: string;
  complexity?: ExampleComplexity;
  tags?: string[];
  relatedSlugs?: string[];
  featured?: boolean;
}

export const categories: { value: ExampleCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "editor", label: "Editor" },
  { value: "ai", label: "AI" },
  { value: "collaboration", label: "Collaboration" },
];

export const examples: ExampleConfig[] = [
  // ── Editor ──────────────────────────────────────────────────────────────
  {
    slug: "default-editor",
    title: "Default text editor",
    description: "Learn how to create a default rich text editor with Typix.",
    category: "editor",
    available: true,
    previewName: "quick-example",
    complexity: "beginner",
    tags: ["rich-text", "toolbar", "basic"],
    relatedSlugs: ["formatting", "floating-link", "collapsible"],
    featured: true,
  },
  {
    slug: "formatting",
    title: "Formatting",
    description: "Add content formatting to your Typix Editor.",
    category: "editor",
    available: true,
    previewName: "short-cuts",
    complexity: "beginner",
    tags: ["bold", "italic", "headings"],
    relatedSlugs: ["default-editor", "markdown-shortcuts"],
  },
  {
    slug: "auto-link",
    title: "Auto Link",
    description: "Automatically detect and linkify URLs as you type.",
    category: "editor",
    available: true,
    previewName: "auto-link",
    complexity: "beginner",
    tags: ["links", "auto-detect", "urls"],
    relatedSlugs: ["floating-link", "default-editor"],
  },
  {
    slug: "context-menu",
    title: "Context Menu",
    description: "Right-click context menu with formatting and editor actions.",
    category: "editor",
    available: true,
    previewName: "context-menu",
    complexity: "beginner",
    tags: ["right-click", "menu", "actions"],
    relatedSlugs: ["default-editor", "formatting"],
  },
  {
    slug: "character-limit",
    title: "Character Limit",
    description: "Show a live character count and enforce a maximum length.",
    category: "editor",
    available: true,
    previewName: "character-limit",
    complexity: "beginner",
    tags: ["counter", "limit", "validation"],
    relatedSlugs: ["max-length", "default-editor"],
  },
  {
    slug: "max-length",
    title: "Max Length",
    description: "Hard-limit input length and prevent typing beyond it.",
    category: "editor",
    available: true,
    previewName: "max-length",
    complexity: "beginner",
    tags: ["limit", "constraint", "input"],
    relatedSlugs: ["character-limit", "default-editor"],
  },
  {
    slug: "tab-focus",
    title: "Tab Focus",
    description:
      "Control focus behavior and tab key interactions in the editor.",
    category: "editor",
    available: true,
    previewName: "tab-focus",
    complexity: "beginner",
    tags: ["focus", "accessibility", "keyboard"],
    relatedSlugs: ["default-editor", "context-menu"],
  },
  {
    slug: "floating-link",
    title: "Floating Link",
    description:
      "Floating toolbar for inserting and editing hyperlinks inline.",
    category: "editor",
    available: true,
    previewName: "floating-link",
    complexity: "intermediate",
    tags: ["links", "toolbar", "inline"],
    relatedSlugs: ["auto-link", "default-editor"],
  },
  {
    slug: "collapsible",
    title: "Collapsible",
    description: "Collapsible sections to hide and reveal content blocks.",
    category: "editor",
    available: true,
    previewName: "collapsible",
    complexity: "intermediate",
    tags: ["collapse", "sections", "blocks"],
    relatedSlugs: ["draggable-blocks", "default-editor"],
  },
  {
    slug: "draggable-blocks",
    title: "Draggable Blocks",
    description: "Drag and reorder content blocks with a handle.",
    category: "editor",
    available: true,
    previewName: "draggable-block",
    complexity: "intermediate",
    tags: ["drag", "reorder", "blocks"],
    relatedSlugs: ["collapsible", "images"],
  },
  {
    slug: "images",
    title: "Drag & Drop Images",
    description:
      "Drop or paste images directly into the editor — wired up via the drag-drop-paste extension.",
    category: "editor",
    available: true,
    previewName: "drag-drop-paste",
    complexity: "intermediate",
    tags: ["images", "drag-drop", "paste", "media"],
    relatedSlugs: ["image", "draggable-blocks"],
  },
  {
    slug: "image",
    title: "Image Extension",
    description:
      "Block-level images with resize handles, alignment controls, captions, and alt text.",
    category: "editor",
    available: true,
    previewName: "image",
    complexity: "intermediate",
    tags: ["image", "resize", "alignment", "caption"],
    relatedSlugs: ["images", "draggable-blocks"],
  },
  {
    slug: "code-editor",
    title: "Syntax Highlighting",
    description:
      "Inline syntax highlighting for code blocks powered by Prism.js or Shiki.",
    category: "editor",
    available: true,
    previewName: "code-highlight-prism",
    complexity: "intermediate",
    tags: ["code", "syntax", "prism", "shiki"],
    relatedSlugs: ["code-block", "code-block-prettier"],
  },
  {
    slug: "code-block",
    title: "Code Block",
    description:
      "Multi-line code blocks with language selection — the foundation for syntax highlighting and Prettier formatting.",
    category: "editor",
    available: true,
    previewName: "code-block",
    complexity: "intermediate",
    tags: ["code", "block", "language-picker"],
    relatedSlugs: ["code-editor", "code-block-prettier"],
  },
  {
    slug: "code-block-prettier",
    title: "Code Block + Prettier",
    description:
      "Format code blocks on demand with Prettier — keeps options like tabWidth and singleQuote configurable per editor.",
    category: "editor",
    available: true,
    previewName: "code-block-prettier",
    complexity: "advanced",
    tags: ["code", "prettier", "formatter"],
    relatedSlugs: ["code-block", "code-editor"],
  },
  {
    slug: "mentions",
    title: "Mentions",
    description: "@ mentions with an autocomplete dropdown for users.",
    category: "editor",
    available: true,
    previewName: "mention",
    complexity: "intermediate",
    tags: ["@mention", "autocomplete", "users"],
    relatedSlugs: ["keywords", "slack-messenger"],
  },
  {
    slug: "keywords",
    title: "Keywords",
    description: "Highlight special keywords as styled nodes in the editor.",
    category: "editor",
    available: true,
    previewName: "keywords",
    complexity: "intermediate",
    tags: ["highlight", "nodes", "custom"],
    relatedSlugs: ["mentions", "default-editor"],
  },
  {
    slug: "markdown-shortcuts",
    title: "Markdown Shortcuts",
    description:
      "Type markdown syntax (## , *, `, >, -) and watch it convert to formatted blocks as you go.",
    category: "editor",
    available: false,
    complexity: "beginner",
    tags: ["markdown", "shortcuts", "syntax"],
    relatedSlugs: ["formatting", "slash-command"],
  },
  {
    slug: "slash-command",
    title: "Slash Command",
    description:
      "Notion-style / menu for inserting headings, lists, code blocks, and any custom block.",
    category: "editor",
    available: true,
    previewName: "slash-command",
    complexity: "intermediate",
    tags: ["slash", "menu", "insert", "command"],
    relatedSlugs: ["mentions", "markdown-shortcuts"],
  },
  {
    slug: "tailwind",
    title: "Tailwind Theme",
    description:
      "Drop-in Tailwind-friendly theme tokens — style editor nodes with utility classes instead of custom CSS.",
    category: "editor",
    available: true,
    previewName: "tailwind",
    complexity: "beginner",
    tags: ["tailwind", "styling", "theme", "tokens"],
    relatedSlugs: ["default-editor", "formatting"],
  },
  {
    slug: "tasks",
    title: "Tasks",
    description: "Add task lists to your Typix Editor.",
    category: "editor",
    available: false,
    complexity: "beginner",
    tags: ["tasks", "checklist", "todos"],
    relatedSlugs: ["default-editor", "collapsible"],
  },
  {
    slug: "tables",
    title: "Tables",
    description:
      "Rows, columns, cell merging, resize handles, and frozen headers — built on the Table extension.",
    category: "editor",
    available: false,
    complexity: "advanced",
    tags: ["tables", "grid", "data", "resize"],
    relatedSlugs: ["draggable-blocks", "default-editor"],
  },
  {
    slug: "minimal-note",
    title: "Minimal Note",
    description:
      "A clean, distraction-free writing experience for quick notes.",
    category: "editor",
    available: false,
    complexity: "beginner",
    tags: ["minimal", "note", "writing"],
    relatedSlugs: ["default-editor", "markdown-shortcuts"],
  },
  // ── AI ──────────────────────────────────────────────────────────────────
  {
    slug: "ai-autocomplete",
    title: "AI Autocomplete",
    description: "AI-powered inline autocomplete suggestions as you type.",
    category: "ai",
    available: true,
    previewName: "auto-complete",
    complexity: "intermediate",
    tags: ["ai", "autocomplete", "suggestions"],
    relatedSlugs: ["speech-to-text", "default-editor"],
  },
  {
    slug: "speech-to-text",
    title: "Speech to Text",
    description: "Dictate content with real-time speech-to-text transcription.",
    category: "ai",
    available: true,
    previewName: "speech-to-text",
    complexity: "intermediate",
    tags: ["speech", "voice", "ai"],
    relatedSlugs: ["ai-autocomplete", "ai-chat"],
  },
  {
    slug: "ai-chat",
    title: "AI Chat Interface",
    description:
      "A conversational editor with markdown rendering and streaming-style input.",
    category: "ai",
    available: false,
    complexity: "advanced",
    tags: ["chat", "streaming", "ai"],
    relatedSlugs: ["ai-autocomplete", "speech-to-text"],
  },
  // ── Collaboration ────────────────────────────────────────────────────────
  {
    slug: "slack-messenger",
    title: "Slack / Discord Messenger",
    description:
      "A messaging-style editor with mentions, emoji, and slash commands.",
    category: "collaboration",
    available: false,
    complexity: "advanced",
    tags: ["messaging", "mentions", "slash-commands"],
    relatedSlugs: ["mentions", "comment-thread"],
  },
  {
    slug: "comment-thread",
    title: "Comment Thread",
    description:
      "A lightweight comment editor for forums with mentions and reactions.",
    category: "collaboration",
    available: false,
    complexity: "intermediate",
    tags: ["comments", "reactions", "thread"],
    relatedSlugs: ["slack-messenger", "mentions"],
  },
];

export function getExampleBySlug(slug: string): ExampleConfig | undefined {
  return examples.find((e) => e.slug === slug);
}

export function getFeaturedExample(): ExampleConfig | undefined {
  return examples.find((e) => e.featured);
}

export function getRelatedExamples(slugs: string[]): ExampleConfig[] {
  return slugs
    .map((slug) => examples.find((e) => e.slug === slug))
    .filter((e): e is ExampleConfig => e !== undefined);
}
