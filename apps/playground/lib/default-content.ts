/**
 * Default editor content for the playground.
 * Serialized Lexical editor state showcasing Typix features.
 */

// ── Format bitmask constants ────────────────────────────────────────
const BOLD = 1;
const ITALIC = 2;
const STRIKETHROUGH = 4;
const CODE = 16;
const SUBSCRIPT = 32;
const SUPERSCRIPT = 64;
const HIGHLIGHT = 128;

// ── Node helpers ────────────────────────────────────────────────────

const t = (text: string, format = 0) => ({
  detail: 0,
  format,
  mode: "normal" as const,
  style: "",
  text,
  type: "text" as const,
  version: 1,
});

const link = (text: string, url: string) => ({
  children: [t(text)],
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  type: "link" as const,
  version: 1,
  rel: "noreferrer",
  target: null,
  title: null,
  url,
});

const paragraph = (...children: object[]) => ({
  children,
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  type: "paragraph" as const,
  version: 1,
  textFormat: 0,
  textStyle: "",
});

const emptyParagraph = () => paragraph();

const heading = (text: string, tag: "h1" | "h2" | "h3" = "h2") => ({
  children: [t(text)],
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  type: "heading" as const,
  version: 1,
  tag,
});

const quote = (...children: object[]) => ({
  children,
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  type: "quote" as const,
  version: 1,
});

const listItem = (children: object[], value: number) => ({
  children,
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  type: "listitem" as const,
  version: 1,
  value,
});

const bulletList = (...items: object[]) => ({
  children: items,
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  type: "list" as const,
  version: 1,
  listType: "bullet" as const,
  start: 1,
  tag: "ul" as const,
});

const codeBlock = (code: string, language: string) => ({
  children: [
    {
      detail: 0,
      format: 0,
      mode: "normal" as const,
      style: "",
      text: code,
      type: "code-highlight" as const,
      version: 1,
      highlightType: null,
    },
  ],
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  type: "code" as const,
  version: 1,
  language,
});

// Table helpers
const tableCell = (children: object[], headerState: 0 | 1 = 0) => ({
  children,
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  type: "tablecell" as const,
  version: 1,
  headerState,
  colSpan: 1,
  rowSpan: 1,
  backgroundColor: null,
});

const tableRow = (...cells: object[]) => ({
  children: cells,
  direction: null,
  format: "" as const,
  indent: 0,
  type: "tablerow" as const,
  version: 1,
});

const table = (...rows: object[]) => ({
  children: rows,
  direction: null,
  format: "" as const,
  indent: 0,
  type: "table" as const,
  version: 1,
});

// Shorthand: header cell with plain text
const hCell = (text: string) => tableCell([paragraph(t(text, BOLD))], 1);

// Shorthand: body cell with plain text
const cell = (text: string) => tableCell([paragraph(t(text))], 0);

// Shorthand: body cell with code-formatted text
const codeCell = (text: string) => tableCell([paragraph(t(text, CODE))], 0);

// Image node (DecoratorNode — no children/direction/indent)
const image = (
  src: string,
  altText: string,
  opts?: {
    width?: number;
    height?: number;
    maxWidth?: number;
    showCaption?: boolean;
    caption?: string;
    alignment?: "left" | "center" | "right" | "full-width";
  }
) => ({
  type: "image" as const,
  version: 1,
  src,
  altText,
  width: opts?.width ?? 0,
  height: opts?.height ?? 0,
  maxWidth: opts?.maxWidth ?? 800,
  showCaption: opts?.showCaption ?? false,
  caption: opts?.caption ?? "",
  alignment: opts?.alignment ?? "center",
});

// ── Content ─────────────────────────────────────────────────────────

export const defaultContent = {
  root: {
    children: [
      // ── Section 1: Getting Started ──────────────────────────────
      heading("Getting Started"),

      paragraph(
        t("Welcome to the "),
        t("Typix Playground", BOLD),
        t("! This editor showcases "),
        t("open source", BOLD),
        t(" UI components and Typix extensions licensed under "),
        t("MIT", BOLD),
        t(
          ". Everything you see here is built with the same primitives you get when you install Typix."
        )
      ),

      paragraph(
        t("Get started by reading the "),
        link("Typix documentation", "https://typix.dev"),
        t(" or install via CLI:")
      ),

      codeBlock("npx @typix-editor/cli init", "bash"),

      image("/typix-mockup.jpg", "Typix Editor mockup", {
        maxWidth: 800,
        showCaption: true,
        caption: "Typix Editor — a modern, extensible rich-text editor",
        alignment: "center",
      }),

      emptyParagraph(),

      // ── Section 2: Rich Text ────────────────────────────────────
      heading("Rich Text"),

      paragraph(
        t("Typix supports a full range of inline formatting. You can combine "),
        t("bold", BOLD),
        t(", "),
        t("italic", ITALIC),
        t(", "),
        t("strikethrough", STRIKETHROUGH),
        t(", "),
        t("inline code", CODE),
        t(", and "),
        t("highlighted text", HIGHLIGHT),
        t(" freely within any paragraph.")
      ),

      quote(
        t("The best way to predict the future is to "),
        t("invent", ITALIC),
        t(" it. — Alan Kay")
      ),

      bulletList(
        listItem(
          [
            t("Superscript", BOLD),
            t(" (x"),
            t("2", SUPERSCRIPT),
            t(") and "),
            t("Subscript", BOLD),
            t(" (H"),
            t("2", SUBSCRIPT),
            t("O) for scientific and mathematical notation."),
          ],
          1
        ),
        listItem(
          [
            t("Typographic conversion", BOLD),
            t(": type "),
            t("->", CODE),
            t(" to get an arrow →."),
          ],
          2
        ),
        listItem(
          [
            t("Markdown shortcuts", BOLD),
            t(": type "),
            t("#", CODE),
            t(" for headings, "),
            t(">", CODE),
            t(" for quotes, "),
            t("-", CODE),
            t(" for lists."),
          ],
          3
        )
      ),

      emptyParagraph(),

      // ── Section 3: Keyboard Shortcuts ───────────────────────────
      heading("Keyboard Shortcuts"),

      paragraph(
        t("Use these shortcuts to format text without leaving the keyboard:")
      ),

      table(
        tableRow(hCell("Shortcut"), hCell("Action")),
        tableRow(codeCell("⌘ + B"), cell("Bold")),
        tableRow(codeCell("⌘ + I"), cell("Italic")),
        tableRow(codeCell("⌘ + U"), cell("Underline")),
        tableRow(codeCell("⌘ + K"), cell("Insert link")),
        tableRow(codeCell("⌘ + Shift + S"), cell("Strikethrough")),
        tableRow(codeCell("⌘ + Shift + H"), cell("Highlight"))
      ),

      emptyParagraph(),

      // ── Section 4: Make it your own ─────────────────────────────
      heading("Make it your own"),

      paragraph(
        t(
          "Switch between light and dark modes, and tailor the editor\u2019s appearance with "
        ),
        t("customizable themes", HIGHLIGHT),
        t(" to match your style. Every component is designed to be "),
        t("composable", BOLD),
        t(" and "),
        t("extensible", BOLD),
        t(" — build exactly the editor you need.")
      ),

      paragraph(t("→ "), link("Learn more", "https://typix.dev")),
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};
