import {
  defineExtension,
  safeCast,
  type EditorThemeClasses,
  type HTMLConfig,
  type InitialEditorStateType,
} from "lexical";
import { namedSignals } from "@typix-editor/core/lexical/extension";

export interface TailwindConfig {
  disabled: boolean;

  // ── Theme overrides ──────────────────────────
  heading?: EditorThemeClasses["heading"];
  text?: EditorThemeClasses["text"];
  list?: EditorThemeClasses["list"];
  paragraph?: string;
  link?: string;
  quote?: string;
  table?: string;
  tableCell?: string;
  tableCellHeader?: string;
  tableCellEditing?: string;
  tableSelection?: string;
  hr?: string;
  hrSelected?: string;
  indent?: string;
  code?: string;
  codeHighlight?: EditorThemeClasses["codeHighlight"];

  // ── Lexical extension passthrough ────────────
  /** Editor namespace. */
  namespace?: string;
  /** Whether the editor starts in read-only mode. */
  editable?: boolean;
  /** Disable Lexical DOM events (advanced). */
  disableEvents?: boolean;
  /** HTML serialization/deserialization config. */
  html?: HTMLConfig;
  /** Initial editor state. */
  $initialEditorState?: InitialEditorStateType;
}

// ─────────────────────────────────────────────
// Default Tailwind theme
// ─────────────────────────────────────────────

const defaultTheme: EditorThemeClasses = {
  paragraph: "relative m-0",
  heading: {
    h1: "text-2xl font-bold m-0",
    h2: "text-xl font-semibold m-0",
    h3: "text-lg font-semibold m-0",
    h4: "text-base font-semibold m-0",
    h5: "text-sm font-semibold m-0",
    h6: "text-xs font-semibold m-0",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "[text-decoration:underline_line-through]",
    code: "font-mono text-[94%] py-px px-1 bg-slate-100 rounded",
    subscript: "text-[0.8em] !align-sub",
    superscript: "text-[0.8em] align-super",
    highlight:
      "bg-[rgba(255,212,0,0.14)] border-solid border-b-2 border-[rgba(255,212,0,0.3)]",
    uppercase: "uppercase",
    lowercase: "lowercase",
    capitalize: "capitalize",
  },
  link: "text-blue-600 hover:underline hover:cursor-pointer",
  quote:
    "m-0 ml-5 mb-2.5 text-[15px] text-gray-500 border-slate-300 border-l-4 border-solid pl-4",
  list: {
    checklist: "",
    listitem: "mx-8 my-0",
    listitemChecked:
      "relative [&]:mx-[0.5em] px-[1.5em] list-none outline-none block min-h-[1.5em] line-through before:w-4 before:h-4 before:top-0.5 before:left-0 before:cursor-pointer before:block before:absolute before:border before:border-solid before:rounded-sm before:border-[rgb(61,135,245)] before:bg-[#3d87f5] before:bg-no-repeat",
    listitemUnchecked:
      "relative [&]:mx-[0.5em] px-[1.5em] list-none outline-none block min-h-[1.5em] before:w-4 before:h-4 before:top-0.5 before:left-0 before:cursor-pointer before:block before:absolute before:border before:border-solid before:rounded-sm before:border-[#999]",
    nested: {
      listitem: "list-none before:hidden after:hidden",
    },
    olDepth: [
      "p-0 m-0 list-outside list-decimal",
      "p-0 m-0 list-outside list-[upper-alpha]",
      "p-0 m-0 list-outside list-[lower-alpha]",
      "p-0 m-0 list-outside list-[upper-roman]",
      "p-0 m-0 list-outside list-[lower-roman]",
    ],
    ul: "p-0 m-0 list-outside list-disc",
  },
  table:
    "border-collapse border-spacing-0 overflow-scroll table-fixed w-max mt-0 mr-[25px] mb-[30px] ml-0",
  tableCell:
    "border border-solid border-[#bbb] w-[75px] min-w-[75px] align-top text-start py-1.5 px-2 relative outline-none",
  tableCellEditing: "shadow-[0_0_5px_rgba(0,0,0,0.4)] rounded-[3px]",
  tableCellHeader: "bg-[#f2f3f5] text-start",
  tableSelection: "selection:bg-transparent",
  hr: "p-0.5 border-none mx-0 my-4 cursor-pointer after:block after:content-[''] after:h-[2px] after:leading-[2px] after:bg-[#ccc]",
  hrSelected: "outline-2 outline-solid outline-[rgb(60,132,244)]",
  indent: "[--lexical-indent-base-value:40px]",
  code: "block bg-slate-50 font-mono text-sm leading-6 mx-0 my-2 overflow-x-auto p-4 tab-[2] rounded-md border border-solid border-slate-200",
  codeHighlight: {
    atrule: "text-[#07a]",
    attr: "text-[#07a]",
    boolean: "text-[#905]",
    builtin: "text-[#690]",
    cdata: "text-[#708090]",
    char: "text-[#690]",
    class: "text-[#dd4a68]",
    "class-name": "text-[#dd4a68]",
    comment: "text-[#708090]",
    constant: "text-[#905]",
    deleted: "text-[#905]",
    doctype: "text-[#708090]",
    entity: "text-[#9a6e3a]",
    function: "text-[#dd4a68]",
    important: "text-[#e90]",
    inserted: "text-[#690]",
    keyword: "text-[#07a]",
    namespace: "text-[#e90]",
    number: "text-[#905]",
    operator: "text-[#9a6e3a]",
    prolog: "text-[#708090]",
    property: "text-[#905]",
    punctuation: "text-[#999]",
    regex: "text-[#e90]",
    selector: "text-[#690]",
    string: "text-[#690]",
    symbol: "text-[#905]",
    tag: "text-[#905]",
    url: "text-[#9a6e3a]",
    variable: "text-[#e90]",
  },
};

// ─────────────────────────────────────────────
// Deep merge helper
// ─────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Partial<T>
): T {
  const result = { ...base };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (isPlainObject(baseVal) && isPlainObject(overrideVal)) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overrideVal as Record<string, unknown>
      ) as T[keyof T];
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal as T[keyof T];
    }
  }
  return result;
}

// ─────────────────────────────────────────────
// Extension factory
// ─────────────────────────────────────────────

export const TailwindExtension = (userConfig: Partial<TailwindConfig> = {}) => {
  const resolvedConfig: TailwindConfig = { disabled: false, ...userConfig };

  // Separate theme overrides from extension passthrough options
  const {
    // Ignored in destructure (handled by Typix / signals)
    disabled: _disabled,
    // Theme overrides
    heading,
    text,
    list,
    paragraph,
    link,
    quote,
    table,
    tableCell,
    tableCellHeader,
    tableCellEditing,
    tableSelection,
    hr,
    hrSelected,
    indent,
    code,
    codeHighlight,
    // Lexical extension passthrough
    namespace,
    editable,
    disableEvents,
    html,
    $initialEditorState,
  } = resolvedConfig;

  const themeOverrides: Partial<EditorThemeClasses> = {};
  if (heading) themeOverrides.heading = heading;
  if (text) themeOverrides.text = text;
  if (list) themeOverrides.list = list;
  if (paragraph) themeOverrides.paragraph = paragraph;
  if (link) themeOverrides.link = link;
  if (quote) themeOverrides.quote = quote;
  if (table) themeOverrides.table = table;
  if (tableCell) themeOverrides.tableCell = tableCell;
  if (tableCellHeader) themeOverrides.tableCellHeader = tableCellHeader;
  if (tableCellEditing) themeOverrides.tableCellEditing = tableCellEditing;
  if (tableSelection) themeOverrides.tableSelection = tableSelection;
  if (hr) themeOverrides.hr = hr;
  if (hrSelected) themeOverrides.hrSelected = hrSelected;
  if (indent) themeOverrides.indent = indent;
  if (code) themeOverrides.code = code;
  if (codeHighlight) themeOverrides.codeHighlight = codeHighlight;

  const theme = deepMerge(
    defaultTheme as Record<string, unknown>,
    themeOverrides as Record<string, unknown>
  ) as EditorThemeClasses;

  const lexicalExt = defineExtension({
    name: "@typix/tailwind",
    theme,
    ...(namespace != null && { namespace }),
    ...(editable != null && { editable }),
    ...(disableEvents != null && { disableEvents }),
    ...(html != null && { html }),
    ...($initialEditorState != null && { $initialEditorState }),
    config: safeCast<TailwindConfig>(resolvedConfig),
    build(_editor, config) {
      return namedSignals(config);
    },
  });

  return lexicalExt;
};
