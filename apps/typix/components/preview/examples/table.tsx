"use client";

import type { SerializedContent } from "@typix-editor/core";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import {
  TableExtension,
  INSERT_TABLE_COMMAND,
} from "@typix-editor/extension-table";
import { SlashCommandExtension } from "@typix-editor/extension-slash-command";
import { SlashDropdownMenu, TableUI } from "@typix-editor/ui";
import { Table2 } from "lucide-react";
import { ExamplePreview } from "../example-preview";

const tableItem = {
  type: "table",
  title: "Table",
  subtext: "Insert a 3×3 table with a header row",
  aliases: ["table", "grid", "spreadsheet"],
  badge: Table2,
  group: "Blocks",
  onSelect: ({ editor }: { editor: any }) => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: "3",
      columns: "3",
      includeHeaders: true,
    });
  },
};

function cell(text: string, headerState = 0) {
  return {
    type: "tablecell",
    version: 1,
    headerState,
    colSpan: 1,
    rowSpan: 1,
    width: null,
    backgroundColor: null,
    direction: "ltr",
    format: "",
    indent: 0,
    children: [
      {
        type: "paragraph",
        version: 1,
        direction: "ltr",
        format: "",
        indent: 0,
        textFormat: 0,
        textStyle: "",
        children: text
          ? [
              {
                type: "text",
                version: 1,
                text,
                format: headerState === 1 ? 1 : 0,
                detail: 0,
                mode: "normal",
                style: "",
              },
            ]
          : [],
      },
    ],
  };
}

function row(cells: ReturnType<typeof cell>[]) {
  return {
    type: "tablerow",
    version: 1,
    direction: "ltr",
    format: "",
    indent: 0,
    children: cells,
  };
}

const content: SerializedContent = {
  root: {
    type: "root",
    version: 1,
    direction: "ltr",
    format: 0,
    indent: 0,
    children: [
      {
        type: "table",
        version: 1,
        direction: "ltr",
        format: "",
        indent: 0,
        colWidths: [160, 340, 120],
        children: [
          row([
            cell("Extension", 1),
            cell("Description", 1),
            cell("Ships UI", 1),
          ]),
          row([
            cell("StarterKit"),
            cell("Bold, italic, headings, lists, history, alignment"),
            cell("No"),
          ]),
          row([
            cell("Mention"),
            cell("@-trigger typeahead with live search"),
            cell("Yes"),
          ]),
          row([
            cell("Slash Command"),
            cell("/ menu for quick block insertion"),
            cell("Yes"),
          ]),
          row([
            cell("Code Block"),
            cell("Syntax-highlighted code with language picker"),
            cell("Yes"),
          ]),
          row([
            cell("Table"),
            cell("N×M grid — merge cells, resize, color rows"),
            cell("Yes"),
          ]),
          row([
            cell("Collapsible"),
            cell("Toggleable accordion sections"),
            cell("No"),
          ]),
        ],
      },
    ],
  },
};

export default function TableExample() {
  return (
    <ExamplePreview
      namespace="example-table"
      extensions={[StarterKit(), TableExtension, SlashCommandExtension]}
      content={content}
      placeholder="Type / and select Table to insert one."
      overlays={
        <>
          <TableUI />
          <SlashDropdownMenu config={{ customItems: [tableItem] }} />
        </>
      }
    />
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `"use client";
import {
  EditorContent,
  TypixEditorContext,
  defaultTheme,
  useTypixEditor,
} from "@typix-editor/react";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { TableExtension, INSERT_TABLE_COMMAND } from "@typix-editor/extension-table";
import { SlashCommandExtension } from "@typix-editor/extension-slash-command";
import { SlashDropdownMenu, TableUI } from "@/components/typix/main";
import { Table2 } from "lucide-react";

const tableItem = {
  type: "table",
  title: "Table",
  subtext: "Insert a 3×3 table with a header row",
  aliases: ["table", "grid"],
  badge: Table2,
  group: "Blocks",
  onSelect: ({ editor }) => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: "3",
      columns: "3",
      includeHeaders: true,
    });
  },
};

const extensions = [StarterKit(), TableExtension, SlashCommandExtension];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Type / to insert a table.">
        <TableUI />
        <SlashDropdownMenu config={{ customItems: [tableItem] }} />
      </EditorContent>
    </TypixEditorContext.Provider>
  );
}`,
  },
];
