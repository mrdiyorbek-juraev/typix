import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force Next.js to transpile @typix-editor/* workspace packages through its
  // own module graph. Without this, the design-system's dist (which marks
  // these as `external`) and the playground's direct imports of the same
  // packages can resolve to two different module instances — producing two
  // distinct extension OBJECTS that share the same `name`, which trips
  // Lexical error #298 ("Multiple extensions registered with name X").
  transpilePackages: [
    "@typix-editor/core",
    "@typix-editor/react",
    "@typix-editor/utils",
    "@typix-editor/ui",
    "@typix-editor/extension-starter-kit",
    "@typix-editor/extension-floating-link",
    "@typix-editor/extension-image",
    "@typix-editor/extension-mention",
    "@typix-editor/extension-code-block",
    "@typix-editor/extension-code-block-prettier",
    "@typix-editor/extension-speech-to-text",
    "@typix-editor/extension-markdown-shortcuts",
    "@typix-editor/extension-tab-focus",
    "@typix-editor/extension-table",
    "@typix-editor/extension-context-menu",
    "@typix-editor/extension-draggable-block",
    "@typix-editor/extension-slash-command",
    "@typix-editor/extension-character-limit",
    "@typix-editor/extension-collapsible",
    "@typix-editor/extension-auto-complete",
    "@typix-editor/extension-auto-link",
    "@typix-editor/extension-code-highlight-prism",
    "@typix-editor/extension-code-highlight-shiki",
    "@typix-editor/extension-keywords",
    "@typix-editor/extension-link",
    "@typix-editor/extension-max-length",
    "@typix-editor/extension-short-cuts",
    "@typix-editor/extension-tailwind",
    "@typix-editor/extension-drag-drop-paste",
  ],
};

export default nextConfig;
